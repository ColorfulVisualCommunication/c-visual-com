from flask import request, current_app
from flask_restful import Resource
from app.models.user_model import User
from app.extensions import db
from app.schemas.user_schema import UserSchema
from app.utils.security import hash_password, token_required, is_strong_password
from app.services.cloudinary_service import upload_avatar_to_cloudinary, delete_avatar_from_cloudinary

user_schema = UserSchema()
users_schema = UserSchema(many=True)

class UserListResource(Resource):
    @token_required
    def get(self, current_user):
        if not current_user.is_admin:
            return {"message": "Admin access required"}, 403
        users = User.query.all()
        return {"users": users_schema.dump(users)}, 200

    def post(self):
        data = request.form.to_dict()
        allowed_fields = {"username", "email", "password"}
        data = {k: v for k, v in data.items() if k in allowed_fields}

        # Strong password check
        password = data.get("password", "")
        if not is_strong_password(password):
            return {
                "error": "Password must be at least 8 characters long, include uppercase, lowercase, digit, and special character."
            }, 400

        errors = user_schema.validate(data, session=db.session, partial=("full_name", "bio", "avatar", "social_links", "last_login")) # type: ignore
        if errors:
            return {"errors": errors}, 400

        existing = User.find_by_email_or_username(
            email=data.get("email") or "", username=data.get("username") or ""
        )
        if existing:
            return {"message": "User already exists"}, 409

        hashed_password = hash_password(password)
        new_user = User(
            username=data["username"],
            email=data["email"],
            password=hashed_password
        )
        db.session.add(new_user)
        db.session.commit()

        # Send welcome email
        try:
            from app.services.email_service import send_email_async
            send_email_async(
                new_user.email,
                "Welcome to Colourful Visual Communication",
                "welcome.html",
                {"username": new_user.username}
            )
        except Exception as exc:
            current_app.logger.error(f"Failed to send welcome email: {exc}")

        return {"user": user_schema.dump(new_user)}, 201

class UserResource(Resource):
    @token_required
    def get(self, current_user, user_id):
        if current_user.id != user_id and not current_user.is_admin:
            return {"message": "Unauthorized access"}, 403
        user = User.query.get_or_404(user_id)
        return {"user": user_schema.dump(user)}, 200

    @token_required
    def put(self, current_user, user_id):
        if current_user.id != user_id and not current_user.is_admin:
            return {"message": "Unauthorized"}, 403

        user = User.query.get_or_404(user_id)
        data = request.form.to_dict()

        # Handle avatar upload
        if "avatar" in request.files:
            avatar_url = upload_avatar_to_cloudinary(request.files["avatar"], user_id=user.id)
            data["avatar"] = avatar_url

        # Handle avatar deletion
        if data.get("avatar") == "delete":
            delete_avatar_from_cloudinary(user.id)
            data["avatar"] = ""

        allowed_fields = {"full_name", "bio", "avatar", "social_links"}
        data = {k: v for k, v in data.items() if k in allowed_fields}

        errors = user_schema.validate(data, partial=True)
        if errors:
            return {"errors": errors}, 400

        for key, value in data.items():
            setattr(user, key, value)
        db.session.commit()
        return {"user": user_schema.dump(user)}, 200

    @token_required
    def delete(self, current_user, user_id):
        if not current_user.is_admin:
            return {"message": "Admin only action"}, 403
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return {"message": "User deleted"}, 200
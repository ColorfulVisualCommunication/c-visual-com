from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
from app.models.user_model import User
from flask import current_app

class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        include_fk = True

    password = fields.String(load_only=True)
    created_at = fields.DateTime(format="iso")
    full_name = fields.String()
    bio = fields.String()
    social_links = fields.Dict()
    last_login = fields.DateTime(format="iso")
    avatar = fields.Method("get_avatar")

    def get_avatar(self, obj):
        default_url = current_app.config.get("DEFAULT_AVATAR_URL")
        return obj.avatar or default_url
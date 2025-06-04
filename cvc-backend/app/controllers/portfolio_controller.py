# cvc-backend/app/controllers/portfolio_controller.py
# projects_controller

from flask import request
from flask_restful import Resource
from app.models.project_model import Project
from app.extensions import db
from app.schemas.project_schema import ProjectSchema
from app.utils.security import token_required
from app.services.cloudinary_service import upload_image_to_cloudinary

project_schema = ProjectSchema()
projects_schema = ProjectSchema(many=True)

class ProjectListResource(Resource):
    def get(self):
        # Get latest 8 projects for homepage, or paginate if "show more"
        limit = int(request.args.get('limit', 8))
        page = int(request.args.get('page', 1))
        pagination = Project.query.order_by(Project.created_at.desc()).paginate(page=page, per_page=limit, error_out=False)
        projects = pagination.items
        return {
            "projects": projects_schema.dump(projects),
            "total": pagination.total,
            "page": page,
            "pages": pagination.pages
        }, 200

    @token_required
    def post(self, current_user):
        if not current_user.is_admin:
            return {"error": "Admin only"}, 403
        data = request.form.to_dict()
        image_url = None
        if "image" in request.files:
            image_url = upload_image_to_cloudinary(request.files["image"], folder="cvisualcom/projects")
        data["image_url"] = image_url if image_url is not None else ""
        errors = project_schema.validate(data, session=db.session) # type: ignore
        if errors:
            return {"errors": errors}, 400
        
        # Create a new project instance
        project = Project(
            title=data["title"],                    # type: ignore
            description=data.get("description"),    # type: ignore
            image_url=data.get("image_url"),        # type: ignore
            link=data.get("link")                   # type: ignore   
        )
        db.session.add(project)
        db.session.commit()
        return {"project": project_schema.dump(project)}, 201

class ProjectResource(Resource):
    def get(self, project_id):
        project = Project.query.get_or_404(project_id)
        return {"project": project_schema.dump(project)}, 200

    @token_required
    def put(self, current_user, project_id):
        if not current_user.is_admin:
            return {"error": "Admin only"}, 403
        project = Project.query.get_or_404(project_id)
        data = request.get_json()
        errors = project_schema.validate(data, partial=True)
        if errors:
            return {"errors": errors}, 400
        for key, value in data.items():
            setattr(project, key, value)
        db.session.commit()
        return {"project": project_schema.dump(project)}, 200

    @token_required
    def delete(self, current_user, project_id):
        if not current_user.is_admin:
            return {"error": "Admin only"}, 403
        project = Project.query.get_or_404(project_id)
        db.session.delete(project)
        db.session.commit()
        return {"message": "Project deleted"}, 200
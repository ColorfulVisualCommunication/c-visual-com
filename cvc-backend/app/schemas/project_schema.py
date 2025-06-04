from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
from app.models.project_model import Project

class ProjectSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Project
        load_instance = True

    created_at = fields.DateTime(format="iso")
    updated_at = fields.DateTime(format="iso")
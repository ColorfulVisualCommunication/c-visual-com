from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
from app.models.blog_model import Blog, Comment

class BlogSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Blog
        load_instance = True

    created_at = fields.DateTime(format="iso")
    updated_at = fields.DateTime(format="iso")
    published_at = fields.DateTime(format="iso")
    author_id = fields.Integer()
    # Use a method field for tags to handle comma-separated string <-> list
    tags = fields.Method("get_tags", deserialize="load_tags")

    def get_tags(self, obj):
        if obj.tags:
            return [tag.strip() for tag in obj.tags.split(",") if tag.strip()]
        return []

    def load_tags(self, value):
        if isinstance(value, list):
            return ",".join(value)
        return value

class CommentSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Comment
        load_instance = True

    created_at = fields.DateTime(format="iso")
    user_id = fields.Integer()
from flask_restful import Api
from flask import Blueprint
from app.controllers.blog_controller import (
    BlogListResource, BlogResource, BlogMineResource,
    BlogCommentListResource, CommentModerateResource, BlogLikeResource
)

blog_bp = Blueprint("blog_bp", __name__)
api = Api(blog_bp)

api.add_resource(BlogListResource, "/")
api.add_resource(BlogResource, "/<blog_id_or_slug>")
api.add_resource(BlogMineResource, "/mine")
api.add_resource(BlogCommentListResource, "/<int:blog_id>/comments")
api.add_resource(CommentModerateResource, "/comments/<int:comment_id>")
api.add_resource(BlogLikeResource, "/<int:blog_id>/like")
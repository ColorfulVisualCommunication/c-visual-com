from flask import request
from flask_restful import Resource
from app.models.blog_model import Blog, Comment, BlogLike
from app.extensions import db
from app.schemas.blog_schema import BlogSchema, CommentSchema
from app.utils.security import token_required
from app.services.cloudinary_service import upload_image_to_cloudinary

blog_schema = BlogSchema()
blogs_schema = BlogSchema(many=True)
comment_schema = CommentSchema()
comments_schema = CommentSchema(many=True)

def is_admin(user):
    return getattr(user, "is_admin", False)

class BlogListResource(Resource):
    def get(self):
        # Enhanced filtering, search, sorting, and pagination
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        tag = request.args.get('tag')
        sort = request.args.get('sort', 'published_at')
        order = request.args.get('order', 'desc')
        q = request.args.get('q')

        query = Blog.query.filter_by(status='published')

        # Filter by tag
        if tag:
            query = query.filter(Blog.tags.ilike(f"%{tag}%"))

        # Full-text search on title and content
        if q:
            query = query.filter(
                Blog.title.ilike(f"%{q}%") | Blog.content.ilike(f"%{q}%")
            )

        # Sorting
        sort_column = getattr(Blog, sort, Blog.published_at)
        if order == 'desc':
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())

        # Pagination
        pagination = query.paginate(page=page, per_page=limit, error_out=False)
        return {
            "blogs": blogs_schema.dump(pagination.items),
            "total": pagination.total,
            "page": page,
            "pages": pagination.pages
        }, 200

    @token_required
    def post(self, current_user):
        if not is_admin(current_user):
            return {"error": "Admin only"}, 403
        data = request.form.to_dict()
        image_url = None
        if "image" in request.files:
            image_url = upload_image_to_cloudinary(request.files["image"], folder="cvisualcom/blogs")
        if image_url is not None:
            data["image_url"] = image_url
        errors = blog_schema.validate(data, session=db.session) # type: ignore
        if errors:
            return {"errors": errors}, 400
        # Check for duplicate slug
        if Blog.query.filter_by(slug=data["slug"]).first():
            return {"error": "Slug already exists. Please use a unique slug."}, 409
        # Create a new blog instance
        blog = Blog(
            title=data["title"],                # type: ignore
            slug=data["slug"],                  # type: ignore
            content=data["content"],            # type: ignore
            status=data.get("status", "draft"), # type: ignore
            author_id=current_user.id,          # type: ignore
            image_url=data.get("image_url"),    # type: ignore
            tags=",".join(data.get("tags", [])) # type: ignore
        )
        db.session.add(blog)
        db.session.commit()
        return {"blog": blog_schema.dump(blog)}, 201

class BlogResource(Resource):
    def get(self, blog_id_or_slug):
        blog = Blog.query.filter(
            (Blog.id == blog_id_or_slug) | (Blog.slug == blog_id_or_slug)
        ).first_or_404()
        if blog.status != "published":
            return {"error": "Not found"}, 404
        return {"blog": blog_schema.dump(blog)}, 200

    @token_required
    def put(self, current_user, blog_id):
        if not is_admin(current_user):
            return {"error": "Admin only"}, 403
        blog = Blog.query.get_or_404(blog_id)
        data = request.get_json()
        errors = blog_schema.validate(data, partial=True)
        if errors:
            return {"errors": errors}, 400
        for key, value in data.items():
            if key == "tags":
                value = ",".join(value)
            setattr(blog, key, value)
        db.session.commit()
        return {"blog": blog_schema.dump(blog)}, 200

    @token_required
    def delete(self, current_user, blog_id):
        if not is_admin(current_user):
            return {"error": "Admin only"}, 403
        
        # Check if the blog exists
        blog = Blog.query.get_or_404(blog_id)
        db.session.delete(blog)
        db.session.commit()
        return {"message": "Blog deleted"}, 200

class BlogMineResource(Resource):
    @token_required
    def get(self, current_user):
        blogs = Blog.query.filter_by(author_id=current_user.id).all()
        return {"blogs": blogs_schema.dump(blogs)}, 200

class BlogCommentListResource(Resource):
    def get(self, blog_id):
        comments = Comment.query.filter_by(blog_id=blog_id, status="approved").all()
        return {"comments": comments_schema.dump(comments)}, 200

    @token_required
    def post(self, current_user, blog_id):
        data = request.get_json()
        errors = comment_schema.validate(data, session=db.session) # type: ignore
        if errors:
            return {"errors": errors}, 400
        
        # create a new comment instance
        comment = Comment(
            blog_id=blog_id,            # type: ignore
            user_id=current_user.id,    # type: ignore
            content=data["content"],    # type: ignore
            status="pending"            # type: ignore
        )
        db.session.add(comment)
        db.session.commit()
        return {"comment": comment_schema.dump(comment)}, 201

class CommentModerateResource(Resource):
    @token_required
    def put(self, current_user, comment_id):
        if not is_admin(current_user):
            return {"error": "Admin only"}, 403
        comment = Comment.query.get_or_404(comment_id)
        data = request.get_json()
        if "status" in data:
            comment.status = data["status"]
        db.session.commit()
        return {"comment": comment_schema.dump(comment)}, 200

class BlogLikeResource(Resource):
    @token_required
    def post(self, current_user, blog_id):
        like = BlogLike.query.filter_by(blog_id=blog_id, user_id=current_user.id).first()
        if like:
            db.session.delete(like)
            db.session.commit()
            return {"liked": False}, 200
        else:
            new_like = BlogLike(
                blog_id=blog_id,        # type: ignore
                user_id=current_user.id # type: ignore
            )
            db.session.add(new_like)
            db.session.commit()
            return {"liked": True}, 200
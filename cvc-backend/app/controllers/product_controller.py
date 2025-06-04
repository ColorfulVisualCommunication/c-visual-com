from flask import request
from flask_restful import Resource
from app.models.product_model import Product
from app.extensions import db
from app.schemas.product_schema import ProductSchema
from app.utils.security import token_required
from app.services.cloudinary_service import upload_image_to_cloudinary

product_schema = ProductSchema()
products_schema = ProductSchema(many=True)

class ProductListResource(Resource):
    # Get all products or create a new product
    def get(self):
        products = Product.query.all()
        return {"products": products_schema.dump(products)}, 200

    @token_required
    # Ensure the user is authenticated and authorized to create a new product
    def post(self, current_user):
        data = request.form.to_dict()
        image_url = None
        if "image" in request.files:
            image_url = upload_image_to_cloudinary(request.files["image"], folder="cvisualcom/products")
        data["image_url"] = image_url if image_url is not None else ""
        errors = product_schema.validate(data, session=db.session) # type: ignore
        if errors:
            return {"errors": errors}, 400
            
        # create a new product instance
        new_product = Product(
            name=data["name"],
            description=data.get("description"),
            price=data["price"],
            in_stock=str(data.get("in_stock", "True")).lower() in ("true", "1", "yes"),
            image_url=data.get("image_url")
        )
        db.session.add(new_product)
        db.session.commit()
        return {"product": product_schema.dump(new_product)}, 201

class ProductResource(Resource):
    # Get, update, or delete a specific product by ID 
    def get(self, product_id):
        product = Product.query.get_or_404(product_id)
        return {"product": product_schema.dump(product)}, 200

    @token_required
    def put(self, current_user, product_id):
        product = Product.query.get_or_404(product_id)
        # Accept both form and file data
        data = request.form.to_dict()
        # Handle image upload if present
        if "image" in request.files:
            image_url = upload_image_to_cloudinary(request.files["image"], folder="cvisualcom/products")
            data["image_url"] = image_url

        errors = product_schema.validate(data, partial=True)
        if errors:
            return {"errors": errors}, 400

        for key, value in data.items():
            # Convert in_stock to boolean if present
            if key == "in_stock":
                value = str(value).lower() in ("true", "1", "yes")
            setattr(product, key, value)
        db.session.commit()
        return {"product": product_schema.dump(product)}, 200

    @token_required
    def delete(self, current_user, product_id):
        product = Product.query.get_or_404(product_id)
        db.session.delete(product)
        db.session.commit()
        return {"message": "Product deleted"}, 200
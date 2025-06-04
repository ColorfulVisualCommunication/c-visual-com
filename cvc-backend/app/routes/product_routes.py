from flask_restful import Api
from flask import Blueprint
from app.controllers.product_controller import ProductListResource, ProductResource

product_bp = Blueprint("product_bp", __name__)
api = Api(product_bp)

api.add_resource(ProductListResource, "/")
api.add_resource(ProductResource, "/<int:product_id>")
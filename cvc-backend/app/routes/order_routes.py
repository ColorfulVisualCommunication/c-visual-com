from flask_restful import Api
from flask import Blueprint
from app.controllers.order_controller import OrderListResource, OrderResource

order_bp = Blueprint("order_bp", __name__)
api = Api(order_bp)

api.add_resource(OrderListResource, "/")
api.add_resource(OrderResource, "/<int:order_id>")
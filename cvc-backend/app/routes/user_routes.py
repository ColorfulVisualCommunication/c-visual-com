# backend/app/routes/user_routes.py

from flask_restful import Api
from flask import Blueprint
from app.controllers.user_controller import UserListResource, UserResource

user_bp = Blueprint("user_bp", __name__)
api = Api(user_bp)

# Define the routes for user-related operations
api.add_resource(UserListResource, "/") # List all users
api.add_resource(UserResource, "/<int:user_id>") # Get, update, or delete a specific user


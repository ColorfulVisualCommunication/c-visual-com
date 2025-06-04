# cvc-backend/app/routes/portfolio_routes.py
# projects_routes

from flask_restful import Api
from flask import Blueprint
from app.controllers.portfolio_controller import ProjectListResource, ProjectResource

portfolio_bp = Blueprint("portfolio_bp", __name__)
api = Api(portfolio_bp)

api.add_resource(ProjectListResource, "/")
api.add_resource(ProjectResource, "/<int:project_id>")
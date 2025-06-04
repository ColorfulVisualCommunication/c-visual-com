from flask import Blueprint
from app.controllers.mpesa_controller import MpesaPayAPI, MpesaCallbackAPI

mpesa_bp = Blueprint("mpesa_bp", __name__)

mpesa_bp.add_url_rule("/pay", view_func=MpesaPayAPI.as_view("mpesa_pay"), methods=["POST"])
mpesa_bp.add_url_rule("/callback", view_func=MpesaCallbackAPI.as_view("mpesa_callback"), methods=["POST"])
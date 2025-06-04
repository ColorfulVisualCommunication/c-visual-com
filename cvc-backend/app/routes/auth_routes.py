from flask import Blueprint, jsonify, current_app
from app.controllers.auth_controller import login
from app.extensions import limiter
from flask_limiter.errors import RateLimitExceeded
from flask_limiter.util import get_remote_address
from app.controllers.auth_controller import forgot_password, reset_password

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
@limiter.limit("5 per minute", methods=["POST"], per_method=True)
@limiter.limit("20 per day", methods=["POST"], per_method=True)
def login_route():
    return login()

@auth_bp.errorhandler(RateLimitExceeded)
def ratelimit_handler(e):
    ip = get_remote_address()
    message = f"Rate limit exceeded for IP: {ip}"
    current_app.logger.warning(message)
    # Send alert email to admin
    try:
        from app.services.email_service import send_email_async
        send_email_async(
            current_app.config.get("MAIL_DEFAULT_SENDER"),
            "Rate Limit Alert",
            "rate_limit_alert.html",
            {"ip": ip, "message": message}
        )
    except Exception as exc:
        current_app.logger.error(f"Failed to send rate limit alert email: {exc}")
    return jsonify({"error": "Too many requests, slow down."}), 429


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password_route():
    return forgot_password()

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password_route():
    return reset_password()
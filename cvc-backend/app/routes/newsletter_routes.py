from flask import Blueprint
from app.controllers.newsletter_controller import subscribe, unsubscribe, send_newsletter, sendinblue_webhook

newsletter_bp = Blueprint("newsletter_bp", __name__)

newsletter_bp.route("/subscribe", methods=["POST"])(subscribe)
newsletter_bp.route("/unsubscribe", methods=["POST", "GET"])(unsubscribe)
newsletter_bp.route("/send", methods=["POST"])(send_newsletter)
newsletter_bp.route("/webhooks/sendinblue", methods=["POST"])(sendinblue_webhook)
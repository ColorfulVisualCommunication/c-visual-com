from flask import request, jsonify
from app.models.subscriber_model import Subscriber
from app.extensions import db

def subscribe():
    data = request.get_json()
    email = data.get("email")
    if not email:
        return jsonify({"error": "Email required"}), 400
    sub = Subscriber.query.filter_by(email=email).first()
    if sub and getattr(sub, "status", None) == "active":
        return jsonify({"message": "Already subscribed"}), 200
    if not sub:
        sub = Subscriber(email=email) # type: ignore
        db.session.add(sub)
    sub.status = "active"
    db.session.commit()
    # Send confirmation email asynchronously
    from app.services.email_service import send_email_async
    send_email_async(
        email,
        "Subscription Confirmed",
        "subscription_confirmation.html",
        {"unsubscribe_url": f"/api/newsletter/unsubscribe?email={email}"}
    )
    return jsonify({"message": "Subscribed successfully"}), 201

def unsubscribe():
    email = request.args.get("email")
    if not email and request.is_json:
        email = request.get_json().get("email")
    if not email:
        return jsonify({"error": "Email required"}), 400
    sub = Subscriber.query.filter_by(email=email).first()
    if not sub:
        return jsonify({"error": "Subscriber not found"}), 404
    sub.status = "unsubscribed"
    db.session.commit()
    return jsonify({"message": "Unsubscribed successfully"}), 200

def send_newsletter():
    data = request.get_json()
    subject = data.get("subject")
    content = data.get("content")
    if not subject or not content:
        return jsonify({"error": "Subject and content required"}), 400
    subscribers = Subscriber.query.filter_by(status="active").all()
    from app.services.email_service import send_email_async
    for sub in subscribers:
        send_email_async(
            sub.email,
            subject,
            "newsletter.html",
            {"content": content, "unsubscribe_url": f"/api/newsletter/unsubscribe?email={sub.email}"}
        )
    return jsonify({"message": "Newsletter sent"}), 200

def sendinblue_webhook():
    event = request.get_json()
    # Log and update subscriber status based on event type
    email = event.get("email")
    event_type = event.get("event")
    sub = Subscriber.query.filter_by(email=email).first()
    if sub:
        if event_type == "unsubscribe":
            sub.status = "unsubscribed"
            db.session.commit()
    return jsonify({"status": "received"}), 200
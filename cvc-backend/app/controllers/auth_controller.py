from flask import request, jsonify, current_app
from app.extensions import db
from app.models.user_model import User
from app.utils.security import hash_password, verify_password, is_strong_password, generate_reset_token
from datetime import datetime, timedelta
from app.utils.security import generate_token

def login():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON payload'}), 400

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Missing email or password'}), 400

    # Strong password check (optional for login, but can be enforced)
    if not is_strong_password(password):
        return jsonify({'error': 'Password must be at least 8 characters long, include uppercase, lowercase, digit, and special character.'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not verify_password(password, user.password):
        return jsonify({'error': 'Invalid credentials'}), 401

    token, expires = generate_token(identity=user.id)
    return jsonify({
        'access_token': token,
        'expires_at': expires.isoformat(),
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_admin': user.is_admin
        }
    }), 200

def forgot_password():
    data = request.get_json()
    email = data.get('email')
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "If that email exists, a reset link will be sent."}), 200

    token = generate_reset_token()
    user.reset_token = token
    user.reset_token_expiry = datetime.utcnow() + timedelta(hours=1)
    db.session.commit()

    # Send email
    try:
        from app.services.email_service import send_email_async
        reset_url = f"{current_app.config.get('FRONTEND_URL')}/reset-password?token={token}"
        send_email_async(
            user.email,
            "Password Reset Request",
            "reset_password.html",
            {"username": user.username, "reset_url": reset_url}
        )
    except Exception as exc:
        current_app.logger.error(f"Failed to send reset email: {exc}")

    return jsonify({"message": "If that email exists, a reset link will be sent."}), 200

def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('password', '')
    if not is_strong_password(new_password):
        return jsonify({'error': 'Password must be at least 8 characters long, include uppercase, lowercase, digit, and special character.'}), 400

    user = User.query.filter_by(reset_token=token).first()
    if not user or not user.reset_token_expiry or user.reset_token_expiry < datetime.utcnow():
        return jsonify({'error': 'Invalid or expired token.'}), 400

    user.password = hash_password(new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    db.session.commit()
    return jsonify({'message': 'Password reset successful.'}), 200
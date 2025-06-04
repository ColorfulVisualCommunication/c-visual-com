from werkzeug.security import generate_password_hash, check_password_hash
from flask import request, jsonify
from functools import wraps
from app.models.user_model import User
from app.extensions import db
import jwt
import datetime
import re
import os
import secrets

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-default-secret")

# strong password validation
def is_strong_password(password: str) -> bool:
    # At least 8 chars, one uppercase, one lowercase, one digit, one special char
    pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
    return bool(re.match(pattern, password))


def generate_reset_token():
    return secrets.token_urlsafe(32)

# Generate a JWT token
def generate_token(identity, expires_in=None):
    expires = datetime.datetime.utcnow() + datetime.timedelta(
        days=int(os.getenv("JWT_EXPIRY_DAYS", 1))
    )
    payload = {
        'exp': expires,
        'iat': datetime.datetime.utcnow(),
        'sub': str(identity)
    }
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')
    return token, expires


def hash_password(password):
    return generate_password_hash(password)

def verify_password(plain_password, hashed_password):
    return check_password_hash(hashed_password, plain_password)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            bearer = request.headers['Authorization']
            token = bearer.split()[1] if bearer.startswith("Bearer ") else bearer

        if not token:
            return {'message': 'Token is missing!'}, 401

        try:
            data = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
            user_id = int(data['sub'])
            current_user = db.session.get(User, user_id)
            if not current_user:
                raise Exception('User not found')
        except Exception as e:
            return {'message': 'Token is invalid!', 'error': str(e)}, 401
        return f(args[0], current_user, *args[1:], **kwargs)

    return decorated

from app.extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    # New profile fields
    full_name = db.Column(db.String(120), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    avatar = db.Column(db.String(255), nullable=True)
    social_links = db.Column(db.JSON, nullable=True)
    last_login = db.Column(db.DateTime, nullable=True)
    reset_token = db.Column(db.String(128), nullable=True)
    reset_token_expiry = db.Column(db.DateTime, nullable=True)

    def __init__(self, username, email, password, is_admin=False, full_name=None, bio=None, avatar=None, social_links=None, last_login=None):
        self.username = username
        self.email = email
        self.password = password
        self.is_admin = is_admin
        self.full_name = full_name
        self.bio = bio
        self.avatar = avatar
        self.social_links = social_links
        self.last_login = last_login

    @classmethod
    def find_by_email_or_username(cls, email: str, username: str):
        """Find a user by email or username."""
        return db.session.query(cls).filter(
            (cls.email == email) | (cls.username == username)
        ).first()

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "is_admin": self.is_admin
        }
    
    def __repr__(self):
        return f"<User {self.username}>"
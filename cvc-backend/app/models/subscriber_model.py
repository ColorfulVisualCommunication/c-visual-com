from app.extensions import db
from datetime import datetime

class Subscriber(db.Model):
    __tablename__ = "subscribers"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    status = db.Column(db.String(20), default="active")  # active/unsubscribed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    subscriber_metadata = db.Column(db.JSON, nullable=True)
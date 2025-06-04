# CVC is a web application for managing a product catalog and user orders.
# cvc-backend/app/models/order_model.py

from app.extensions import db
from datetime import datetime

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    total_price = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    mpesa_receipt = db.Column(db.String(50), nullable=True)
    mpesa_phone = db.Column(db.String(20), nullable=True)
    mpesa_amount = db.Column(db.Numeric(10, 2), nullable=True)
    mpesa_result_code = db.Column(db.Integer, nullable=True)
    mpesa_result_desc = db.Column(db.String(255), nullable=True)
    mpesa_transaction_date = db.Column(db.String(20), nullable=True)
    mpesa_checkout_request_id = db.Column(db.String(100), nullable=True)

    user = db.relationship('User', backref='orders')
    product = db.relationship('Product', backref='orders')
# -*- coding: utf-8 -*-
# cvc-backend/app/models/product_model.py

from app.extensions import db
from datetime import datetime

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(255), nullable=True)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    in_stock = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, name, description, image_url, price, in_stock=True):
        self.name = name
        self.description = description
        self.image_url = image_url
        self.price = price
        self.in_stock = in_stock
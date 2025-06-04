from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
from app.models.order_model import Order

class OrderSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Order
        load_instance = True

    product_id = fields.Integer(required=True, load_only=True)
    user_id = fields.Integer(load_only=True)
    created_at = fields.DateTime(format="iso")
    total_price = fields.Float()
    status = fields.String()
    quantity = fields.Integer()
    mpesa_receipt = fields.String()
    mpesa_phone = fields.String()
    mpesa_amount = fields.Float()
    mpesa_result_code = fields.Integer()
    mpesa_result_desc = fields.String()
    mpesa_transaction_date = fields.String()
    mpesa_checkout_request_id = fields.String()
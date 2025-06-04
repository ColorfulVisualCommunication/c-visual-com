from flask import request, jsonify
from flask.views import MethodView
from app.models.order_model import Order
from app.extensions import db
from app.services.mpesa_service import stk_push
from app.models.user_model import User
import logging

logger = logging.getLogger("mpesa_logger")

class MpesaPayAPI(MethodView):
    def post(self):
        data = request.get_json()
        phone = data.get("phone")
        amount = data.get("amount")
        reference = data.get("reference")
        order_id = data.get("order_id")  # The frontend should send the order_id to link payment to order

        if not all([phone, amount, reference, order_id]):
            return jsonify({"error": "phone, amount, reference, and order_id are required"}), 400

        order = Order.query.get(order_id)
        if not order:
            return jsonify({"error": "Order not found"}), 404

        try:
            result = stk_push(phone, amount, reference, order=order)
            return jsonify(result), 200
        except Exception as e:
            logger.error(f"STK Push failed: {str(e)}")
            return jsonify({"error": str(e)}), 500

class MpesaCallbackAPI(MethodView):
    def post(self):
        callback_data = request.get_json()
        logger.info(f"M-PESA Callback: {callback_data}")

        stk_callback = callback_data.get("Body", {}).get("stkCallback", {})
        result_code = stk_callback.get("ResultCode")
        result_desc = stk_callback.get("ResultDesc")
        checkout_request_id = stk_callback.get("CheckoutRequestID")
        metadata = stk_callback.get("CallbackMetadata", {}).get("Item", [])

        # Extract values from metadata
        amount = receipt = phone = transaction_date = None
        for item in metadata:
            if item["Name"] == "Amount":
                amount = item["Value"]
            elif item["Name"] == "MpesaReceiptNumber":
                receipt = item["Value"]
            elif item["Name"] == "PhoneNumber":
                phone = str(item["Value"])
            elif item["Name"] == "TransactionDate":
                transaction_date = str(item["Value"])

        # Find the order by CheckoutRequestID
        order = Order.query.filter_by(mpesa_checkout_request_id=checkout_request_id).first()
        if not order:
            logger.warning("Order not found for callback")
            return jsonify({"error": "Order not found"}), 404

        # Update order with M-PESA details
        order.mpesa_receipt = receipt
        order.mpesa_phone = phone
        order.mpesa_amount = amount
        order.mpesa_result_code = result_code
        order.mpesa_result_desc = result_desc
        order.mpesa_transaction_date = transaction_date
        order.status = "paid" if result_code == 0 else "failed"

        db.session.commit()
        logger.info(f"Order {order.id} updated with M-PESA result: {result_code}")


        # Send order confirmation email if paid
        if result_code == 0:
            user = User.query.get(order.user_id)
            if user:
                from app.services.email_service import send_email_async
                send_email_async(
                    user.email,
                    "Order Confirmation",
                    "order_confirmation.html",
                    {"username": user.username, "order_id": order.id}
                )

        return jsonify({"result": "Callback processed"}), 200
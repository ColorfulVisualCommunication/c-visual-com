import logging
from flask import request
from flask_restful import Resource
from app.models.order_model import Order
from app.models.product_model import Product
from app.models.user_model import User
from app.extensions import db
from app.schemas.order_schema import OrderSchema
from app.utils.security import token_required

order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)

logger = logging.getLogger("order_logger")
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.INFO)

class OrderListResource(Resource):
    @token_required
    def get(self, current_user):
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        status = request.args.get('status')
        date_from = request.args.get('date_from')

        query = Order.query
        if not current_user.is_admin:
            query = query.filter_by(user_id=current_user.id)
        if status:
            query = query.filter_by(status=status)
        if date_from:
            try:
                from datetime import datetime
                date_obj = datetime.strptime(date_from, "%Y-%m-%d")
                query = query.filter(Order.created_at >= date_obj)
            except Exception:
                return {"error": "Invalid date_from format. Use YYYY-MM-DD."}, 400

        pagination = query.order_by(Order.created_at.desc()).paginate(page=page, per_page=limit, error_out=False)
        orders = pagination.items
        return {
            "orders": orders_schema.dump(orders),
            "total": pagination.total,
            "page": page,
            "pages": pagination.pages
        }, 200

    @token_required
    def post(self, current_user):
        data = request.get_json()
        errors = order_schema.validate(data, session=db.session) # type: ignore
        if errors:
            logger.warning(f"Order creation failed: {errors}")
            return {"errors": errors}, 400

        product_id = data.get("product_id")
        quantity = data.get("quantity", 1)
        status = data.get("status", "pending")

        product = Product.query.get(product_id)
        if not product:
            logger.warning("Order creation failed: Product not found")
            return {"message": "Product not found"}, 404

        total_price = float(product.price) * quantity

        new_order = Order(
            user_id=current_user.id,    # type: ignore
            product_id=product.id,      # type: ignore
            quantity=quantity,          # type: ignore
            total_price=total_price,    # type: ignore
            status=status               # type: ignore
        )
        db.session.add(new_order)
        db.session.commit()
        logger.info(f"Order created: {new_order.id} by user {current_user.id}")
        return {"order": order_schema.dump(new_order)}, 201

class OrderResource(Resource):
    @token_required
    def get(self, current_user, order_id):
        order = Order.query.get(order_id)
        if not order:
            return {"error": "Order not found"}, 404
        if not current_user.is_admin and order.user_id != current_user.id:
            logger.warning(f"Unauthorized order view attempt by user {current_user.id}")
            return {"error": "Unauthorized"}, 403
        return {"order": order_schema.dump(order)}, 200

    @token_required
    def put(self, current_user, order_id):
        order = Order.query.get(order_id)
        if not order:
            return {"error": "Order not found"}, 404
        if not current_user.is_admin and order.user_id != current_user.id:
            logger.warning(f"Unauthorized order update attempt by user {current_user.id}")
            return {"error": "Unauthorized"}, 403

        data = request.get_json()
        errors = order_schema.validate(data, partial=True)
        if errors:
            return {"errors": errors}, 400

        # Only admin can change status except user can set status to 'cancelled'
        if "status" in data:
            if current_user.is_admin:
                order.status = data["status"]
            elif data["status"] == "cancelled" and order.user_id == current_user.id:
                order.status = "cancelled"
            else:
                return {"error": "Only admin can change status except cancelling your own order."}, 403

        # Allow user/admin to update quantity (optional)
        if "quantity" in data:
            order.quantity = data["quantity"]
            # Recalculate total price if quantity changes
            product = Product.query.get(order.product_id)
            if product:
                order.total_price = float(product.price) * order.quantity

        db.session.commit()

        # Send order confirmation email if status changed to "paid"
        if "status" in data and data["status"] == "paid":
            user = User.query.get(order.user_id)
            if user:
                from app.services.email_service import send_email_async
                send_email_async(
                    user.email,
                    "Order Confirmation",
                    "order_confirmation.html",
                    {"username": user.username, "order_id": order.id}
                )

        logger.info(f"Order updated: {order.id} by user {current_user.id}")
        return {"order": order_schema.dump(order)}, 200

    @token_required
    def delete(self, current_user, order_id):
        order = Order.query.get(order_id)
        if not order:
            return {"error": "Order not found"}, 404
        if not current_user.is_admin and order.user_id != current_user.id:
            logger.warning(f"Unauthorized order delete attempt by user {current_user.id}")
            return {"error": "Unauthorized"}, 403

        db.session.delete(order)
        db.session.commit()
        logger.info(f"Order deleted: {order.id} by user {current_user.id}")
        return {"message": "Order deleted"}, 200
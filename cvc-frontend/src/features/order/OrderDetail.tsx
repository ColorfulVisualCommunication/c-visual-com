import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import SEO from "../../components/SEO";
import Loader from "../../components/ui/Loader";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => setOrder(res.data.order))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return <div className="text-danger">Order not found.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <SEO title={`Order #${order.id}`} />
      <h1 className="text-2xl font-bold text-primary mb-4">Order #{order.id}</h1>
      <div className="bg-brand-dark rounded shadow p-4">
        <div className="mb-2">Product: <span className="text-primary">{order.product?.name}</span></div>
        <div className="mb-2">Quantity: {order.quantity}</div>
        <div className="mb-2">Total: <span className="text-warning">${order.total_price}</span></div>
        <div className="mb-2">Status: <span className={order.status === "paid" ? "text-primary" : "text-warning"}>{order.status}</span></div>
        <div className="mb-2">Ordered At: {new Date(order.created_at).toLocaleString()}</div>
      </div>
    </div>
  );
}
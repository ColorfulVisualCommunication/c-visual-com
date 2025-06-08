import { useEffect, useState } from "react";
import api from "../../services/api";
import SEO from "../../components/SEO";
import Loader from "../../components/ui/Loader";

type Order = {
  id: string;
  product: { name: string };
  quantity: number;
  total_price: number;
  status: string;
};

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => setOrders(res.data.orders))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <SEO title="My Orders" />
      <h1 className="text-2xl font-bold text-primary mb-4">My Orders</h1>
      <table className="w-full bg-brand-dark rounded shadow">
        <thead>
          <tr className="text-left border-b border-primary">
            <th className="p-2">Product</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Total</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} className="border-b border-gray-800">
              <td className="p-2">{order.product?.name}</td>
              <td className="p-2">{order.quantity}</td>
              <td className="p-2">${order.total_price}</td>
              <td className={order.status === "paid" ? "text-primary" : "text-warning"}>
                {order.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
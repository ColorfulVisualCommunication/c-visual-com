import { useState } from "react";
import api from "../../services/api";
import SEO from "../../components/SEO";
import Button from "../../components/ui/Button";

export default function Checkout({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      await api.post("/orders", { product_id: productId, quantity }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setMessage("Order placed! Check your orders page.");
    } catch (err: any) {
      setError(err.response?.data?.error || "Checkout failed");
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <SEO title="Checkout" />
      <form onSubmit={handleSubmit} className="bg-brand-dark p-6 rounded shadow space-y-4">
        <h2 className="text-xl font-bold text-primary">Checkout</h2>
        {error && <div className="text-danger">{error}</div>}
        {message && <div className="text-primary">{message}</div>}
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          type="number"
          min={1}
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
          required
        />
        <Button type="submit" className="w-full">Place Order</Button>
      </form>
    </div>
  );
}
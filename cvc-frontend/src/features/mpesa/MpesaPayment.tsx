import { useState } from "react";
import api from "../../services/api";
import SEO from "../../components/SEO";
import Button from "../../components/ui/Button";

export default function MpesaPayment() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      await api.post("/mpesa/pay", { phone, amount });
      setMessage("Payment initiated. Complete on your phone.");
    } catch (err: any) {
      setError(err.response?.data?.error || "Payment failed");
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <SEO title="Mpesa Payment" />
      <form onSubmit={handleSubmit} className="bg-brand-dark p-6 rounded shadow space-y-4">
        <h2 className="text-xl font-bold text-primary">Pay with Mpesa</h2>
        {error && <div className="text-danger">{error}</div>}
        {message && <div className="text-primary">{message}</div>}
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          type="tel"
          placeholder="Phone (07xxxxxxxx)"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
        />
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">Pay</Button>
      </form>
    </div>
  );
}
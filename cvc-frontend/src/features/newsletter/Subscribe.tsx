import { useState } from "react";
import api from "../../services/api";
import SEO from "../../components/SEO";
import Button from "../../components/ui/Button";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      await api.post("/newsletter/subscribe", { email });
      setMessage("Subscribed! Check your inbox.");
    } catch (err: any) {
      setError(err.response?.data?.error || "Subscription failed");
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <SEO title="Subscribe to Newsletter" />
      <form onSubmit={handleSubmit} className="bg-brand-dark p-6 rounded shadow space-y-4">
        <h2 className="text-xl font-bold text-primary">Subscribe to our Newsletter</h2>
        {error && <div className="text-danger">{error}</div>}
        {message && <div className="text-primary">{message}</div>}
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">Subscribe</Button>
      </form>
    </div>
  );
}
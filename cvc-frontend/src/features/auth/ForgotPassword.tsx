import { useState } from "react";
import api from "../../services/api";
import Button from "../../components/ui/Button";
import SEO from "../../components/SEO";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      await api.post("/auth/forgot-password", { email });
      setMessage("If that email exists, a reset link will be sent.");
    } catch (err: any) {
      setError(err.response?.data?.error || "Request failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <SEO title="Forgot Password" />
      <form
        onSubmit={handleSubmit}
        className="bg-brand-dark p-8 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-primary mb-4">Forgot Password</h2>
        {error && <div className="text-danger">{error}</div>}
        {message && <div className="text-primary">{message}</div>}
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">Send Reset Link</Button>
        <div className="text-sm mt-2">
          <a href="/login" className="text-primary hover:underline">Back to Login</a>
        </div>
      </form>
    </div>
  );
}
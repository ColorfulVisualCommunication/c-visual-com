import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Button from "../../components/ui/Button";
import SEO from "../../components/SEO";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      await api.post("/auth/reset-password", { token, password });
      setMessage("Password reset successful! You can now login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || "Reset failed");
    }
  };

  if (!token) {
    return <div className="text-danger text-center mt-8">Invalid or missing token.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <SEO title="Reset Password" />
      <form
        onSubmit={handleSubmit}
        className="bg-brand-dark p-8 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-primary mb-4">Reset Password</h2>
        {error && <div className="text-danger">{error}</div>}
        {message && <div className="text-primary">{message}</div>}
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          type="password"
          placeholder="New Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">Reset Password</Button>
      </form>
    </div>
  );
}
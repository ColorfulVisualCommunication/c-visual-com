import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Button from "../../components/ui/Button";
import SEO from "../../components/SEO";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <SEO title="Login" />
      <form
        onSubmit={handleSubmit}
        className="bg-brand-dark p-8 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-primary mb-4">Login</h2>
        {error && <div className="text-danger">{error}</div>}
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">Login</Button>
        <div className="flex justify-between text-sm mt-2">
          <a href="/register" className="text-primary hover:underline">Register</a>
          <a href="/forgot-password" className="text-warning hover:underline">Forgot Password?</a>
        </div>
      </form>
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Button from "../../components/ui/Button";
import SEO from "../../components/SEO";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await api.post("/user/", form, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
      setSuccess("Registration successful! Please login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <SEO title="Register" />
      <form
        onSubmit={handleSubmit}
        className="bg-brand-dark p-8 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-primary mb-4">Register</h2>
        {error && <div className="text-danger">{error}</div>}
        {success && <div className="text-primary">{success}</div>}
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <Button type="submit" className="w-full">Register</Button>
        <div className="text-sm mt-2">
          <a href="/login" className="text-primary hover:underline">Already have an account?</a>
        </div>
      </form>
    </div>
  );
}
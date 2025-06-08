import { useState } from "react";
import api from "../../services/api";
import SEO from "../../components/SEO";
import Button from "../../components/ui/Button";

export default function BlogEditor() {
  const [form, setForm] = useState({ title: "", content: "", image_url: "" });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await api.post("/blogs", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSuccess("Blog published!");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to publish blog");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-brand-dark rounded-lg shadow-lg p-6">
      <SEO title="Write Blog" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-primary mb-4">Write Blog</h2>
        {error && <div className="text-danger">{error}</div>}
        {success && <div className="text-primary">{success}</div>}
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          className="w-full p-2 rounded bg-gray-800 text-white"
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          required
        />
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          name="image_url"
          placeholder="Image URL"
          value={form.image_url}
          onChange={handleChange}
        />
        <Button type="submit" className="w-full">Publish</Button>
      </form>
    </div>
  );
}
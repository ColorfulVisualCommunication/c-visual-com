import { useState } from "react";
import api from "../../services/api";
import SEO from "../../components/SEO";
import Button from "../../components/ui/Button";

export default function ProjectEditor() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
  });
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
      await api.post(
        "/projects",
        form,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setSuccess("Project created!");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create project");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-brand-dark rounded-lg shadow-lg p-6">
      <SEO title="Add Project" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-primary mb-4">Add Project</h2>
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
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          name="link"
          placeholder="Project Link"
          value={form.link}
          onChange={handleChange}
        />
        <Button type="submit" className="w-full">Create</Button>
      </form>
    </div>
  );
}
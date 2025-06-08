import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import SEO from "../../components/SEO";
import Button from "../../components/ui/Button";

export default function ProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", description: "", image_url: "", price: "", in_stock: true });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      api.get(`/products/${id}`).then(res => {
        setForm(res.data.product);
      });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? target.checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      if (id) {
        await api.put(`/products/${id}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setSuccess("Product updated!");
      } else {
        await api.post("/products", form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setSuccess("Product created!");
      }
      setTimeout(() => navigate("/products"), 1200);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save product");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-brand-dark rounded-lg shadow-lg p-6">
      <SEO title={id ? "Edit Product" : "Add Product"} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-primary mb-4">{id ? "Edit" : "Add"} Product</h2>
        {error && <div className="text-danger">{error}</div>}
        {success && <div className="text-primary">{success}</div>}
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          name="name"
          placeholder="Name"
          value={form.name}
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
          name="image_url"
          placeholder="Image URL"
          value={form.image_url}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="in_stock"
            checked={form.in_stock}
            onChange={handleChange}
          />
          <span className="text-white">In Stock</span>
        </label>
        <Button type="submit" className="w-full">{id ? "Update" : "Create"}</Button>
      </form>
    </div>
  );
}
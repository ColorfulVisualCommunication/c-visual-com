import { useEffect, useState } from "react";
import api from "../../services/api";
import SEO from "../../components/SEO";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";

export default function EditProfile() {
  const [form, setForm] = useState({
    full_name: "",
    bio: "",
    avatar: "",
    social_links: "",
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get("/user/me")
      .then(res => {
        setForm({
          full_name: res.data.user.full_name || "",
          bio: res.data.user.bio || "",
          avatar: res.data.user.avatar || "",
          social_links: JSON.stringify(res.data.user.social_links || {}),
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await api.put("/user/me", {
        ...form,
        social_links: JSON.parse(form.social_links || "{}"),
      });
      setSuccess("Profile updated!");
    } catch (err: any) {
      setError(err.response?.data?.error || "Update failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-brand-dark rounded-lg shadow-lg p-6">
      <SEO title="Edit Profile" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-primary mb-4">Edit Profile</h2>
        {error && <div className="text-danger">{error}</div>}
        {success && <div className="text-primary">{success}</div>}
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
        />
        <textarea
          className="w-full p-2 rounded bg-gray-800 text-white"
          name="bio"
          placeholder="Bio"
          value={form.bio}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          name="avatar"
          placeholder="Avatar URL"
          value={form.avatar}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          name="social_links"
          placeholder='Social Links (JSON: {"twitter":"...","linkedin":"..."})'
          value={form.social_links}
          onChange={handleChange}
        />
        <Button type="submit" className="w-full">Save</Button>
      </form>
    </div>
  );
}
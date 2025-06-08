import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import SEO from "../../components/SEO";
import Loader from "../../components/ui/Loader";

type Blog = {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  slug: string;
};

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/blogs/${id}`)
      .then(res => setBlog(res.data.blog))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!blog) return <div className="text-danger">Blog not found.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <SEO title={blog.title} />
      {blog.image_url && (
        <img src={blog.image_url} alt={blog.title} className="w-full rounded-lg mb-4" />
      )}
      <h1 className="text-3xl font-bold text-primary mb-2">{blog.title}</h1>
      <div className="text-gray-300 mb-4">{blog.content}</div>
    </div>
  );
}
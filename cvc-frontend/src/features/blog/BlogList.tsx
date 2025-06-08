import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import SEO from "../../components/SEO";
import Loader from "../../components/ui/Loader";

type Blog = {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  slug: string;
};

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/blogs")
      .then(res => setBlogs(res.data.blogs))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <SEO title="Blog" />
      <h1 className="text-3xl font-bold text-primary mb-6">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map(blog => (
          <Card
            key={blog.id}
            title={blog.title}
            description={blog.content.slice(0, 120) + "..."}
            imageUrl={blog.image_url}
          >
            <a
              href={`/blogs/${blog.slug}`}
              className="text-primary underline mt-2 block"
            >
              Read More
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}
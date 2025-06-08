import { useEffect, useState } from "react";
import api from "../../services/api";
import Button from "../../components/ui/Button";

type Comment = {
  id: string;
  user: { username: string };
  content: string;
  created_at: string;
};

export default function CommentSection({ blogId }: { blogId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get(`/blogs/${blogId}/comments`).then(res => setComments(res.data.comments));
  }, [blogId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post(`/blogs/${blogId}/comments`, { content }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setContent("");
      const res = await api.get(`/blogs/${blogId}/comments`);
      setComments(res.data.comments);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to comment");
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-primary mb-2">Comments</h3>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          className="flex-1 p-2 rounded bg-gray-800 text-white"
          placeholder="Add a comment..."
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
        <Button type="submit">Post</Button>
      </form>
      {error && <div className="text-danger mb-2">{error}</div>}
      <div className="space-y-2">
        {comments.map(c => (
          <div key={c.id} className="bg-gray-900 p-2 rounded">
            <span className="font-bold text-primary">{c.user.username}</span>
            <span className="ml-2 text-gray-400 text-xs">{new Date(c.created_at).toLocaleString()}</span>
            <div className="text-white">{c.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
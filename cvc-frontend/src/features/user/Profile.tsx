import { useEffect, useState } from "react";
import api from "../../services/api";
import SEO from "../../components/SEO";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";

type User = {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  bio?: string;
  avatar?: string;
  social_links?: Record<string, string>;
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/user/me")
      .then(res => setUser(res.data.user))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (!user) return <div className="text-danger">User not found.</div>;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-brand-dark rounded-lg shadow-lg p-6">
      <SEO title="Profile" />
      <div className="flex flex-col items-center gap-4">
        <img
          src={user.avatar || "/default-avatar.png"}
          alt={user.username}
          className="w-24 h-24 rounded-full border-4 border-primary object-cover"
        />
        <h2 className="text-2xl font-bold text-primary">{user.full_name || user.username}</h2>
        <p className="text-gray-300">{user.email}</p>
        {user.bio && <p className="text-gray-400">{user.bio}</p>}
        <div className="flex gap-2 mt-2">
          {user.social_links &&
            Object.entries(user.social_links).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                {platform}
              </a>
            ))}
        </div>
        <Button variant="primary" className="mt-4" onClick={() => window.location.href = "/profile/edit"}>
          Edit Profile
        </Button>
      </div>
    </div>
  );
}
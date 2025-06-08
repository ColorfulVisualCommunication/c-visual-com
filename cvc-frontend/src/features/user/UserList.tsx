import { useEffect, useState } from "react";
import api from "../../services/api";
import SEO from "../../components/SEO";
import Loader from "../../components/ui/Loader";

type User = {
  id: string;
  username: string;
  email: string;
  is_admin: boolean;
};

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/user/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => setUsers(res.data.users))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <SEO title="User Management" />
      <h1 className="text-2xl font-bold text-primary mb-4">All Users</h1>
      <table className="w-full bg-brand-dark rounded shadow">
        <thead>
          <tr className="text-left border-b border-primary">
            <th className="p-2">Username</th>
            <th className="p-2">Email</th>
            <th className="p-2">Admin</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-b border-gray-800">
              <td className="p-2">{u.username}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.is_admin ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SEO from "../../components/SEO";
import api from "../../services/api";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get("/admin/stats", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setStats(res.data));
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <SEO title="Admin Dashboard" />
      <h1 className="text-3xl font-bold text-primary mb-6">Admin Dashboard</h1>
      {!stats ? (
        <div>Loading...</div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <StatCard label="Users" value={stats.users} link="/admin/users" />
          <StatCard label="Projects" value={stats.projects} link="/projects" />
          <StatCard label="Blogs" value={stats.blogs} link="/blogs" />
          <StatCard label="Products" value={stats.products} link="/products" />
          <StatCard label="Orders" value={stats.orders} link="/orders" />
          <StatCard label="Subscribers" value={stats.subscribers} link="/admin/newsletter" />
        </motion.div>
      )}
    </div>
  );
}

function StatCard({ label, value, link }: { label: string; value: number; link: string }) {
  return (
    <Link to={link}>
      <div className="bg-brand-dark rounded shadow p-6 flex flex-col items-center hover:scale-105 transition-transform">
        <span className="text-xl font-bold text-primary">{label}</span>
        <span className="text-3xl font-extrabold text-warning">{value}</span>
      </div>
    </Link>
  );
}
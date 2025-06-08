import { useEffect, useState } from "react";
import SEO from "../../components/SEO";
import api from "../../services/api";
import { motion } from "framer-motion";

export default function AdminAnalytics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get("/admin/analytics", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setData(res.data));
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <SEO title="Analytics" />
      <h1 className="text-3xl font-bold text-primary mb-6">Analytics</h1>
      {!data ? (
        <div>Loading...</div>
      ) : (
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AnalyticsChart title="Revenue (Last 6 Months)" data={data.revenue} color="#fab216" />
          <AnalyticsChart title="Orders (Last 6 Months)" data={data.orders} color="#45bbeb" />
          <AnalyticsChart title="User Growth" data={data.users} color="#ed3162" />
        </motion.div>
      )}
    </div>
  );
}

// Dummy chart component (replace with a chart lib for real charts)
function AnalyticsChart({ title, data, color }: { title: string; data: number[]; color: string }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2" style={{ color }}>{title}</h2>
      <div className="flex gap-2 items-end h-32">
        {data.map((v, i) => (
          <div key={i} style={{ height: `${v}px`, background: color }} className="w-8 rounded"></div>
        ))}
      </div>
    </div>
  );
}
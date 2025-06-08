import { useEffect, useState } from "react";
import api from "../../services/api";
import SEO from "../../components/SEO";
import Button from "../../components/ui/Button";

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    api.get("/newsletter/subscribers", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setSubscribers(res.data.subscribers));
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    await api.post("/newsletter/send", { subject, body }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setMessage("Newsletter sent!");
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <SEO title="Newsletter Admin" />
      <h1 className="text-2xl font-bold text-primary mb-4">Newsletter Subscribers</h1>
      <div className="bg-brand-dark rounded shadow p-4 mb-6">
        <ul className="space-y-1">
          {subscribers.map(s => (
            <li key={s.id} className="text-white">{s.email}</li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleSend} className="bg-brand-dark rounded shadow p-4 space-y-4">
        <h2 className="text-xl font-bold text-warning">Send Newsletter</h2>
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          placeholder="Subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          required
        />
        <textarea
          className="w-full p-2 rounded bg-gray-800 text-white"
          placeholder="Body"
          value={body}
          onChange={e => setBody(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">Send</Button>
        {message && <div className="text-primary">{message}</div>}
      </form>
    </div>
  );
}
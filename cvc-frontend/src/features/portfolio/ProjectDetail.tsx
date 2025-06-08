import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import SEO from "../../components/SEO";
import Loader from "../../components/ui/Loader";

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
};

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/projects/${id}`)
      .then(res => setProject(res.data.project))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!project) return <div className="text-danger">Project not found.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <SEO title={project.title} />
      <img src={project.image} alt={project.title} className="w-full rounded-lg mb-4" />
      <h1 className="text-3xl font-bold text-primary mb-2">{project.title}</h1>
      <p className="text-gray-300 mb-4">{project.description}</p>
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          View Live
        </a>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import SEO from "../../components/SEO";
import Loader from "../../components/ui/Loader";

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
};

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/projects")
      .then(res => setProjects(res.data.projects))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <SEO title="Portfolio" />
      <h1 className="text-3xl font-bold text-primary mb-6">Portfolio</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Card
            key={project.id}
            title={project.title}
            description={project.description}
            imageUrl={project.image}
          >
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline mt-2 block"
              >
                View Project
              </a>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
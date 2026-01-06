import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { api, Blog } from "@/lib/api";

const Projects = () => {
  const [projects, setProjects] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await api.blogs.getByCategory('projects', 1, 50);
      setProjects(data.blogs);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 border-b border-border pb-4">
          All Projects
        </h1>
        
        <div>
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard 
                key={project._id}
                title={project.title}
                excerpt={project.body.substring(0, 200) + '...'}
                slug={project.slug}
              />
            ))
          ) : (
            <p className="text-muted-foreground">No projects published yet.</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Projects;
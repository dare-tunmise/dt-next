import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { api, Blog } from "@/lib/api";

// 1. Metadata for SEO
export const metadata: Metadata = {
  title: "Projects | Dare Tunmise",
  description: "A showcase of backend systems, AI agents, and software engineering projects built by Dare Tunmise.",
  openGraph: {
    title: "Projects by Dare Tunmise",
    description: "Scalable backend systems and AI-powered tools.",
    url: "https://www.daretunmise.com/projects",
  },
};

// 2. The Server Component
export default async function ProjectsPage() {
  let projects: Blog[] = [];

  try {
    // Direct server-side fetch
    const data = await api.blogs.getByCategory('projects', 1, 50);
    projects = data.blogs || [];
  } catch (error) {
    console.error('Failed to load projects:', error);
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 border-b border-border pb-4">
          All Projects
        </h1>
        
        <div className="space-y-8">
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard 
                key={project._id}
                title={project.title}
                // Cleaning the string for the preview
                excerpt={project.body.substring(0, 200).replace(/[#*`]/g, '') + '...'}
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
}
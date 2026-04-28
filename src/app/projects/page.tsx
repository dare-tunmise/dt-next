import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { api, Blog } from "@/lib/api";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Software projects by Dare Tunmise — backend systems, AI agents, and developer tools. Explore source code on GitHub and read the build notes.",
  keywords: [
    "Dare Tunmise projects",
    "software engineering portfolio",
    "AI agents",
    "backend systems",
    "open source",
  ],
  alternates: { canonical: "https://www.daretunmise.com/projects" },
  openGraph: {
    title: "Projects | Dare Tunmise",
    description: "Backend systems, AI agents, and developer tools by Dare Tunmise.",
    url: "https://www.daretunmise.com/projects",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Projects by Dare Tunmise" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects by Dare Tunmise",
    description: "Backend systems, AI agents, and developer tools.",
    images: ["/og-image.jpg"],
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
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IndexRow from "@/components/IndexRow";
import { api, Blog } from "@/lib/api";
import { pageFrame, pageTitle, standfirst, formatDate } from "@/lib/typography";

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
  alternates: { canonical: "https://daretunmise.com/projects" },
  openGraph: {
    siteName: "Dare Tunmise",
    title: "Projects | Dare Tunmise",
    description: "Backend systems, AI agents, and developer tools by Dare Tunmise.",
    url: "https://daretunmise.com/projects",
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

      <main className={`${pageFrame} pb-16`}>
        <div className="mt-16 sm:mt-20">
          <h1 className={pageTitle}>Projects</h1>
          <p className={standfirst}>
            Backend systems, AI agents, and developer tools.
          </p>
        </div>

        <div className="mt-16 border-b border-border sm:mt-20">
          {projects.length > 0 ? (
            projects.map((project) => (
              <IndexRow
                key={project._id}
                title={project.title}
                href={`/project/${project.slug}`}
                meta={formatDate(project.date)}
              />
            ))
          ) : (
            <p className="border-t border-border py-5 italic text-muted-foreground">
              No projects published yet.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

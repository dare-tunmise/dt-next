"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, Blog } from "@/lib/api";
import Footer from "@/components/Footer";

interface Props {
  slug: string;
}

const cleanHTML = (html: string) => {
  return html
    .replace(/&nbsp;/g, ' ')
    .replace(/<p><br><\/p>/g, '<br/>');
};

const ProjectClientPage = ({ slug }: Props) => {
  const [project, setProject] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (slug) {
      loadProject();
    }
  }, [slug]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const data = await api.blogs.getBySlug(slug);
      setProject(data);
    } catch (error) {
      console.error('Failed to load project:', error);
      setError(true);
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

  if (error || !project) {
    return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-12 max-w-3xl text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/projects" className="text-accent hover:underline">
            ← Back to projects
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-accent">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/projects" className="hover:text-accent">Projects</Link>
          <span className="mx-2">›</span>
          <span>{project.title}</span>
        </nav>

        <article className="w-full max-w-full overflow-hidden">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 leading-tight break-words">
            {project.title}
          </h1>

          {project.githubLink && (
            <div className="mb-8 pb-8 border-b border-border">
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent hover:underline text-lg"
              >
                <span>→</span> View on GitHub
              </a>
            </div>
          )}

          <div
            className="prose prose-invert max-w-none ql-editor"
            dangerouslySetInnerHTML={{ __html: cleanHTML(project.body) }}
          />
        </article>

        <div className="mt-16 pt-8 border-t border-border">
          <Link
            href="/projects"
            className="text-accent hover:underline"
          >
            ← Back to projects
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectClientPage;

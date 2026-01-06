import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { api, Blog } from "@/lib/api";

const ProjectPost = () => {
  const { slug } = useParams<{ slug: string }>();
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
      const data = await api.blogs.getBySlug(slug!);
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

  {project && (
  <Helmet>
    <title>{project.title} - Dare Tunmise</title>
    <meta name="description" content={project.body.replace(/<[^>]*>/g, '').substring(0, 160)} />
    
    <meta property="og:title" content={project.title} />
    <meta property="og:description" content={project.body.replace(/<[^>]*>/g, '').substring(0, 160)} />
    <meta property="og:url" content={`https://daretunmise.com/blog/${project.slug}`} />
    <meta property="og:type" content="article" />
    
    <meta name="twitter:title" content={project.title} />
    <meta name="twitter:description" content={project.body.replace(/<[^>]*>/g, '').substring(0, 160)} />
  </Helmet>
)}

  if (error || !project) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-12 max-w-3xl text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/projects" className="text-accent hover:underline">
            ← Back to projects
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* <Header /> */}
      
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-accent">Home</Link>
          <span className="mx-2">›</span>
          <Link to="/projects" className="hover:text-accent">Projects</Link>
          <span className="mx-2">›</span>
          <span>Current Page</span>
        </nav>

        {/* Article */}
        <article>
          <h1 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
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
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: project.body }}
          />
        </article>

        {/* Navigation */}
        <div className="mt-16 pt-8 border-t border-border">
          <Link 
            to="/projects"
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

export default ProjectPost;
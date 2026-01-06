import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import ProjectCard from "@/components/ProjectCard";
import { api, Blog } from "@/lib/api";


const Index = () => {
  const [recentWritings, setRecentWritings] = useState<Blog[]>([]);
  const [recentProjects, setRecentProjects] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      // Fetch recent writings (limit 3)
      const writingsData = await api.blogs.getByCategory('writings', 1, 3);
      setRecentWritings(writingsData.blogs);

      // Fetch recent projects (limit 2)
      const projectsData = await api.blogs.getByCategory('projects', 1, 2);
      setRecentProjects(projectsData.blogs);
    } catch (error) {
      console.error('Failed to load content:', error);
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
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Hero Section */}
        <section className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            dare tunmise
          </h1>
          <header className="border-border">
            <div className="container mx-auto px-0 py-6 max-w-3xl">
              <nav className="flex items-center gap-8 text-sm">
                <Link 
                  to="/about" 
                  className="hover:text-accent transition-colors"
                >
                  About
                </Link>
                <Link 
                  to="/writings" 
                  className="hover:text-accent transition-colors"
                >
                  writings
                </Link>
                <Link 
                  to="/projects" 
                  className="hover:text-accent transition-colors"
                >
                  Projects
                </Link>
                <Link 
                  to="/book" 
                  className="hover:text-accent transition-colors"
                >
                  Book
                </Link>
              </nav>
            </div>
          </header>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Software developer and writer. I build scalable backend systems, AI tools, and fun things on the web.
          </p>
        </section>

        {/* Writings Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 border-b border-border pb-4">
            WRITINGS
          </h2>
          <div className="mb-6">
            {recentWritings.length > 0 ? (
              recentWritings.map((writing) => (
                <BlogCard 
                  key={writing._id} 
                  title={writing.title}
                  excerpt={writing.body.substring(0, 150) + '...'}
                  slug={writing.slug}
                  date={new Date(writing.date || '').toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                  readTime={writing.readTime || ''}
                />
              ))
            ) : (
              <p className="text-muted-foreground">No writings yet.</p>
            )}
          </div>
          <Link 
            to="/writings"
            className="text-accent hover:underline inline-block"
          >
            Read all writings →
          </Link>
        </section>

        {/* Projects Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 border-b border-border pb-4">
            PROJECTS
          </h2>
          <div className="mb-6">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <ProjectCard 
                  key={project._id}
                  title={project.title}
                  excerpt={project.body.substring(0, 150) + '...'}
                  slug={project.slug}
                />
              ))
            ) : (
              <p className="text-muted-foreground">No projects yet.</p>
            )}
          </div>
          <Link 
            to="/projects"
            className="text-accent hover:underline inline-block"
          >
            See all projects →
          </Link>
        </section>

        {/* Book Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 border-b border-border pb-4">
            BOOK
          </h2>
          <article className="mb-6">
            <h3 className="text-xl font-bold mb-3">
              A failed attempt at undoing memories
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
             Tunmise writes in praise of memory's complexity and resilience. He is mindful of the ways in which memory stores and is the store; the ways in which it is beholden to naming and ordering, as well as how it represents…
            </p>
            <Link 
              to="/book"
              className="text-accent hover:underline"
            >
              Learn more about the book →
            </Link>
          </article>
        </section>
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default Index;
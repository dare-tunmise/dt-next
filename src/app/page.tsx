import { Metadata } from "next";
import Link from 'next/link';
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import ProjectCard from "@/components/ProjectCard";
import { api, Blog } from "@/lib/api";


export default async function Index() {
let recentWritings: Blog[] = [];
  let recentProjects: Blog[] = [];

  try {
    // Fetch data directly on server
    const [writingsData, projectsData] = await Promise.all([
      api.blogs.getByCategory('writings', 1, 3),
      api.blogs.getByCategory('projects', 1, 2)
    ]);
    
    recentWritings = writingsData.blogs || [];
    recentProjects = projectsData.blogs || [];
  } catch (error) {
    console.error('Failed to load home content:', error);
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
                  href="/about" 
                  className="hover:text-accent transition-colors"
                >
                  About
                </Link>
                <Link 
                  href="/writings" 
                  className="hover:text-accent transition-colors"
                >
                  writings
                </Link>
                <Link 
                  href="/projects" 
                  className="hover:text-accent transition-colors"
                >
                  Projects
                </Link>
                <Link 
                  href="/book" 
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
                  excerpt={writing.body.substring(0, 150).replace(/[#*`]/g, '') + '...'}
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
          <Link href="/writings" className="text-accent hover:underline inline-block">
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
                  excerpt={project.body.substring(0, 150).replace(/[#*`]/g, '') + '...'}
                  slug={project.slug}
                />
              ))
            ) : (
              <p className="text-muted-foreground">No projects yet.</p>
            )}
          </div>
          <Link href="/projects" className="text-accent hover:underline inline-block">
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
             Tunmise writes in praise of memory&apos;s complexity and resilience. He is mindful of the ways in which memory stores and is the store; the ways in which it is beholden to naming and ordering...
            </p>
            <Link href="/book" className="text-accent hover:underline">
              Learn more about the book →
            </Link>
          </article>
        </section>

      </main>

      <Footer />
    </div>
  );
};

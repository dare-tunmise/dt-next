import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { api, Blog } from "@/lib/api";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const data = await api.blogs.getBySlug(slug!);
      setPost(data);
    } catch (error) {
      console.error('Failed to load post:', error);
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

  {post && (
  <Helmet>
    <title>{post.title} - Dare Tunmise</title>
    <meta name="description" content={post.body.replace(/<[^>]*>/g, '').substring(0, 160)} />
    
    <meta property="og:title" content={post.title} />
    <meta property="og:description" content={post.body.replace(/<[^>]*>/g, '').substring(0, 160)} />
    <meta property="og:url" content={`https://daretunmise.com/writing/${post.slug}`} />
    <meta property="og:type" content="article" />
    
    <meta name="twitter:title" content={post.title} />
    <meta name="twitter:description" content={post.body.replace(/<[^>]*>/g, '').substring(0, 160)} />
  </Helmet>
)}

  if (error || !post) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-12 max-w-3xl text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/writings" className="text-accent hover:underline">
            ← Back to writings
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
          <Link to={`/${post.category}`} className="hover:text-accent capitalize">
            {post.category}
          </Link>
          <span className="mx-2">›</span>
          <span>Current Page</span>
        </nav>

        {/* Article */}
        <article>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {post.title}
          </h1>
          
          <div className="text-sm text-accent mb-8">
            {new Date(post.date || '').toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })} / Read time: {post.readTime}
          </div>

          {post.githubLink && (
            <div className="mb-8">
              <a 
                href={post.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline inline-flex items-center gap-2"
              >
                <span>→</span> View on GitHub
              </a>
            </div>
          )}
          
        <div 
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
        </article>

        {/* Navigation */}
        <div className="mt-16 pt-8 border-t border-border">
          <Link 
            to={`/${post.category}`}
            className="text-accent hover:underline"
          >
            ← Back to {post.category}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
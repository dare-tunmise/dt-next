import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { api, Blog } from "@/lib/api";

const Writings = () => {
  const [writings, setWritings] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWritings();
  }, []);

  const loadWritings = async () => {
    try {
      const data = await api.blogs.getByCategory('writings', 1, 50);
      setWritings(data.blogs);
    } catch (error) {
      console.error('Failed to load writings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to group posts by year
  const groupPostsByYear = (posts: Blog[]) => {
    const grouped = posts.reduce((acc, post) => {
      const postYear = new Date(post.date || '').getFullYear();
      if (!acc[postYear]) {
        acc[postYear] = [];
      }
      acc[postYear].push(post);
      return acc;
    }, {} as Record<number, Blog[]>);

    // Sort years in descending order (newest first)
    return Object.entries(grouped)
      .map(([year, posts]) => ({ 
        year: parseInt(year), 
        posts 
      }))
      .sort((a, b) => b.year - a.year);
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
          All Writings
        </h1>
        
        <div>
          {writings.length > 0 ? (
            // Group and display by year
            groupPostsByYear(writings).map((yearGroup) => (
              <div key={yearGroup.year} className="mb-12 last:mb-0">
                {/* Year Header */}
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#e8dbc9' }}>
                  {yearGroup.year}
                </h2>
                
                {/* List of posts for this year */}
                <div className="space-y-6">
                  {yearGroup.posts.map((writing) => (
                    <BlogCard 
                      key={writing._id}
                      title={writing.title}
                      excerpt={writing.body.substring(0, 200) + '...'}
                      slug={writing.slug}
                      date={new Date(writing.date || '').toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                      readTime={writing.readTime || ''}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No writings published yet.</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Writings;
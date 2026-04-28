export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { api, Blog } from "@/lib/api";


export const metadata: Metadata = {
  title: "Writings",
  description:
    "Essays and writings by Dare Tunmise on software engineering, AI, language models, systems design, and the human side of building things.",
  keywords: [
    "Dare Tunmise writings",
    "Dare Tunmise essays",
    "software engineering essays",
    "AI essays",
    "writing",
  ],
  alternates: { canonical: "https://www.daretunmise.com/writings" },
  openGraph: {
    title: "Writings | Dare Tunmise",
    description:
      "Essays and writings by Dare Tunmise on software engineering, AI, and systems design.",
    url: "https://www.daretunmise.com/writings",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Writings by Dare Tunmise" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Writings by Dare Tunmise",
    description: "Essays on code, writing, and building systems.",
    images: ["/og-image.jpg"],
  },
};

// 2. Helper Logic (Stays on server)
const groupPostsByYear = (posts: Blog[]) => {
  const grouped = posts.reduce((acc, post) => {
    const postYear = new Date(post.date || '').getFullYear();
    if (!acc[postYear]) acc[postYear] = [];
    acc[postYear].push(post);
    return acc;
  }, {} as Record<number, Blog[]>);

  return Object.entries(grouped)
    .map(([year, posts]) => ({ 
      year: parseInt(year), 
      posts 
    }))
    .sort((a, b) => b.year - a.year);
};

// 3. The Server Component (Async)
export default async function WritingsPage() {
  // Data is fetched directly on the server during request time
  let writings: Blog[] = [];
  try {
    const data = await api.blogs.getByCategory('writings', 1, 50);
    writings = data.blogs || [];
  } catch (error) {
    console.error('Failed to load writings:', error);
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
            groupPostsByYear(writings).map((yearGroup) => (
              <div key={yearGroup.year} className="mb-12 last:mb-0">
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#e8dbc9' }}>
                  {yearGroup.year}
                </h2>
                
                <div className="space-y-6">
                  {yearGroup.posts.map((writing) => (
                    <BlogCard 
                      key={writing._id}
                      title={writing.title}
                      // Clean up content for preview
                      excerpt={writing.body.substring(0, 200).replace(/[#*`]/g, '') + '...'}
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
}
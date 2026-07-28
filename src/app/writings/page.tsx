export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IndexRow from "@/components/IndexRow";
import { api, Blog } from "@/lib/api";
import { sectionLabel, pageFrame, pageTitle, standfirst, formatDate } from "@/lib/typography";


export const metadata: Metadata = {
  title: "Writings",
  description:
    "Essays and writings by Dare Tunmise on software engineering, AI, language models, systems design, and the mundane.",
  keywords: [
    "Dare Tunmise writings",
    "Dare Tunmise essays",
    "software engineering essays",
    "AI essays",
    "writing",
  ],
  alternates: { canonical: "https://www.daretunmise.com/writings" },
  openGraph: {
    siteName: "Dare Tunmise",
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

      <main className={`${pageFrame} pb-16`}>
        <div className="mt-16 sm:mt-20">
          <h1 className={pageTitle}>Writings</h1>
          <p className={standfirst}>
            Essays on software engineering, language models, and the mundane.
          </p>
        </div>

        {writings.length > 0 ? (
          groupPostsByYear(writings).map((yearGroup) => (
            <section key={yearGroup.year} className="mt-16 sm:mt-20">
              <h2 className={sectionLabel}>{yearGroup.year}</h2>
              <div className="mt-6 border-b border-border">
                {yearGroup.posts.map((writing) => (
                  <IndexRow
                    key={writing._id}
                    title={writing.title}
                    href={`/writing/${writing.slug}`}
                    meta={formatDate(writing.date)}
                  />
                ))}
              </div>
            </section>
          ))
        ) : (
          <p className="mt-16 italic text-muted-foreground">
            No writings published yet.
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}

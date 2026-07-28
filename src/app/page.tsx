import { Metadata } from "next";
import Link from 'next/link';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IndexRow from "@/components/IndexRow";
import { api, Blog } from "@/lib/api";
import { sectionLabel, moreLink, pageFrame, formatDate } from "@/lib/typography";

export const metadata: Metadata = {
  title: { absolute: "Dare Tunmise — Software Engineer, Writer & Poet" },
  description:
    "Dare Tunmise is a software engineer, writer, and poet. Read essays, see backend & AI projects, and explore the poetry collection \"A Failed Attempt at Undoing Memories.\"",
  alternates: { canonical: "https://www.daretunmise.com" },
  openGraph: {
    siteName: "Dare Tunmise",
    title: "Dare Tunmise — Software Engineer, Writer & Poet",
    description:
      "Essays, software projects, and the poetry collection \"A Failed Attempt at Undoing Memories.\"",
    url: "https://www.daretunmise.com",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Dare Tunmise" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dare Tunmise — Software Engineer, Writer & Poet",
    description: "Essays, software projects, and a poetry collection.",
    images: ["/og-image.jpg"],
  },
};

// Google derives the site name shown above the URL in search results from
// WebSite markup on the home page. `alternateName` gives it a shorter form to
// fall back on. Deliberately not in the root layout — home page only.
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Dare Tunmise",
  alternateName: "Dare Tunmise — Software Engineer, Writer & Poet",
  url: "https://www.daretunmise.com",
  inLanguage: "en",
  author: {
    "@type": "Person",
    name: "Dare Tunmise",
    url: "https://www.daretunmise.com",
  },
};

export default async function Index() {
  let recentWritings: Blog[] = [];
  let recentProjects: Blog[] = [];

  try {
    // Fetch data directly on server
    const [writingsData, projectsData] = await Promise.all([
      api.blogs.getByCategory('writings', 1, 6),
      api.blogs.getByCategory('projects', 1, 4)
    ]);

    recentWritings = writingsData.blogs || [];
    recentProjects = projectsData.blogs || [];
  } catch (error) {
    console.error('Failed to load home content:', error);
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Header />

      <main className={`${pageFrame} pb-16`}>
        {/* Standfirst */}
        <p className="mt-16 text-lg italic leading-relaxed sm:mt-20 sm:text-xl">
          Software developer and writer. I build scalable backend systems, AI tools,
          and fun things on the web.{' '}
          <Link
            href="/about"
            className="underline underline-offset-4 transition-colors hover:text-accent"
          >
            More about me.
          </Link>
        </p>

        {/* Writings */}
        <section className="mt-16 sm:mt-20">
          <h2 className={sectionLabel}>Writings</h2>
          <div className="mt-6 border-b border-border">
            {recentWritings.length > 0 ? (
              recentWritings.map((writing) => (
                <IndexRow
                  key={writing._id}
                  title={writing.title}
                  href={`/writing/${writing.slug}`}
                  meta={formatDate(writing.date)}
                />
              ))
            ) : (
              <p className="border-t border-border py-5 italic text-muted-foreground">
                No writings yet.
              </p>
            )}
          </div>
          <div className="mt-5 text-right">
            <Link href="/writings" className={moreLink}>All writings →</Link>
          </div>
        </section>

        {/* Projects */}
        <section className="mt-16 sm:mt-20">
          <h2 className={sectionLabel}>Projects</h2>
          <div className="mt-6 border-b border-border">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <IndexRow
                  key={project._id}
                  title={project.title}
                  href={`/project/${project.slug}`}
                  meta={formatDate(project.date)}
                />
              ))
            ) : (
              <p className="border-t border-border py-5 italic text-muted-foreground">
                No projects yet.
              </p>
            )}
          </div>
          <div className="mt-5 text-right">
            <Link href="/projects" className={moreLink}>All projects →</Link>
          </div>
        </section>

        {/* Book */}
        <section className="mt-16 sm:mt-20">
          <h2 className={sectionLabel}>Book</h2>
          <div className="mt-6 border-b border-border">
            <IndexRow
              title="A failed attempt at undoing memories"
              href="/book"
              meta="Poetry"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

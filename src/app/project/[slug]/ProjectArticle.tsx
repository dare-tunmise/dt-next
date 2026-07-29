import Link from "next/link";
import { Blog } from "@/lib/api";
import { cleanPostHtml } from "@/lib/html";
import { sectionLabel } from "@/lib/typography";
import Footer from "@/components/Footer";
import PostNav from "@/components/PostNav";

interface Props {
  post: Blog;
}

// Plain server component: the project page has no interactive elements, so it
// ships no client JS at all.
const ProjectArticle = ({ post }: Props) => {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-accent">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/projects" className="hover:text-accent">Projects</Link>
          <span className="mx-2">›</span>
          <span>{post.title}</span>
        </nav>

        <article className="w-full max-w-full overflow-hidden">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 leading-tight break-words">
            {post.title}
          </h1>

          {post.githubLink && (
            <div className="mb-8 pb-8 border-b border-border">
              <a
                href={post.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent hover:underline text-lg"
              >
                <span>→</span> View
              </a>
            </div>
          )}

          <div
            className="prose prose-invert max-w-none ql-editor"
            dangerouslySetInnerHTML={{ __html: cleanPostHtml(post.body) }}
          />
        </article>

        <PostNav prev={post.prev} next={post.next} basePath="project" />

        <div className="mt-10">
          <Link href="/projects" className={sectionLabel}>
            All projects
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectArticle;

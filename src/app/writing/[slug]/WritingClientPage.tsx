"use client";

import { useEffect, useRef, useState } from "react";
import Link from 'next/link';
import Script from 'next/script';
import { api, Blog } from "@/lib/api";
import Footer from "@/components/Footer";

declare global {
  interface Window {
    initSlowclapWidget?: (container: HTMLElement) => void;
    destroySlowclapWidget?: (container: HTMLElement) => void;
  }
}

interface Props {
  slug: string;
}

const WritingClientPage = ({ slug }: Props) => {
  const [post, setPost] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  const cleanHTML = (html: string) => {
  return html
    .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces with normal spaces
    .replace(/<p><br><\/p>/g, '<br/>'); // Fix double-spacing on empty lines
};

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  useEffect(() => {
    if (!scriptReady || !post?._id || !widgetRef.current) return;
    const el = widgetRef.current;
    window.destroySlowclapWidget?.(el);
    window.initSlowclapWidget?.(el);
  }, [scriptReady, post?._id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const data = await api.blogs.getBySlug(slug);
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

  if (error || !post) {
    return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-12 max-w-3xl text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/writings" className="text-accent hover:underline">
            ← Back to writings
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
          <Link href={`/${post.category}`} className="hover:text-accent capitalize">
            {post.category}
          </Link>
          <span className="mx-2">›</span>
          <span>{post.title}</span>
        </nav>

        <article className="w-full max-w-full overflow-hidden">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight break-words">
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
          className="prose prose-invert max-w-none ql-editor"
          dangerouslySetInnerHTML={{ __html: cleanHTML(post.body) }}
        />
        </article>

        <div className="mt-12 flex justify-center">
          <div
            key={post._id}
            ref={widgetRef}
            className="slowclap-widget"
            data-platform-id={post._id}
            data-color-accent="#ff8000"
            data-color-default="#1a1a1a"
            data-color-clapped="#ff8000"
            data-color-text="#dccfb8"
          />
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <Link href={`/writings`} className="text-accent hover:underline">
            ← Back to writings
          </Link>
        </div>
      </main>
      <Footer />
      <Script
        src="https://slowclap.xyz/widget.js"
        data-key={process.env.NEXT_PUBLIC_SLOWCLAP_KEY}
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
    </div>
  );
};

export default WritingClientPage;
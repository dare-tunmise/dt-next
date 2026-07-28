export const dynamic = 'force-dynamic';

import { cache } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from "@/lib/api";
import { sentenceCase } from "@/lib/typography";
import ViewTracker from "@/components/ViewTracker";
import WritingClientPage from './WritingClientPage';

const SITE_URL = "https://daretunmise.com";

type Props = {
  params: Promise<{ slug: string }>;
};

// generateMetadata and the page body both need the post. cache() dedupes them
// into a single request-scoped fetch instead of hitting the API twice.
const getPost = cache((slug: string) => api.blogs.getBySlug(slug));

// Bodies are Quill HTML with long runs of &nbsp;. Stripping tags alone leaves
// those entities as literal text in the meta description and JSON-LD, so decode
// them too — and replace tags with a space so words don't run together.
const toDescription = (body: string) =>
  body
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 160);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getPost(slug);
    // Search surfaces only — the page keeps the author's lowercase.
    const description = sentenceCase(toDescription(post.body));
    const displayTitle = sentenceCase(post.title);
    const url = `${SITE_URL}/writing/${post.slug}`;

    return {
      title: displayTitle,
      description,
      authors: [{ name: "Dare Tunmise", url: SITE_URL }],
      alternates: { canonical: url },
      openGraph: {
        title: displayTitle,
        description,
        url,
        siteName: "Dare Tunmise",
        type: "article",
        publishedTime: post.date,
        modifiedTime: post.updatedAt || post.date,
        authors: ["Dare Tunmise"],
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: post.title }],
      },
      twitter: {
        card: "summary_large_image",
        title: displayTitle,
        description,
        creator: "@Dare_Tunmise",
        images: ["/og-image.jpg"],
      },
    };
  } catch (error) {
    return { title: "Post Not Found" };
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  let post;
  try {
    post = await getPost(slug);
  } catch {
    // Real 404 status rather than a 200 page that says "not found".
    notFound();
  }

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: toDescription(post.body),
    image: `${SITE_URL}/og-image.jpg`,
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    author: { "@type": "Person", name: "Dare Tunmise", url: SITE_URL },
    publisher: { "@type": "Person", name: "Dare Tunmise", url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/writing/${post.slug}` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <ViewTracker slug={post.slug} />
      <WritingClientPage post={post} />
    </>
  );
}

export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { api } from "@/lib/api";
import ProjectClientPage from './ProjectClientPage';

const SITE_URL = "https://www.daretunmise.com";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await api.blogs.getBySlug(slug);
    const description = post.body.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().substring(0, 160);
    const url = `${SITE_URL}/project/${post.slug}`;

    return {
      title: post.title,
      description,
      authors: [{ name: "Dare Tunmise", url: SITE_URL }],
      alternates: { canonical: url },
      openGraph: {
        title: post.title,
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
        title: post.title,
        description,
        creator: "@Dare_Tunmise",
        images: ["/og-image.jpg"],
      },
    };
  } catch (error) {
    return { title: "Project Not Found" };
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  let post = null;
  try {
    post = await api.blogs.getBySlug(slug);
  } catch {
    // Client component handles error UI
  }

  const articleSchema = post
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.body.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().substring(0, 160),
        image: `${SITE_URL}/og-image.jpg`,
        datePublished: post.date,
        dateModified: post.updatedAt || post.date,
        author: { "@type": "Person", name: "Dare Tunmise", url: SITE_URL },
        publisher: { "@type": "Person", name: "Dare Tunmise", url: SITE_URL },
        mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/project/${post.slug}` },
        ...(post.githubLink ? { codeRepository: post.githubLink } : {}),
      }
    : null;

  return (
    <>
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      <ProjectClientPage slug={slug} />
    </>
  );
}

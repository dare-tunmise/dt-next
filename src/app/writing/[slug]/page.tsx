import { Metadata } from 'next';
import { api } from "@/lib/api";
import WritingClientPage from './WritingClientPage';


type Props = {
  params: Promise<{ slug: string }>;
};

// This function is what Google/Twitter/WhatsApp see!
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    // Fetch data directly on the server
    const post = await api.blogs.getBySlug(slug);
    
    // Clean description (remove HTML tags)
    const description = post.body.replace(/<[^>]*>/g, '').substring(0, 160);

    return {
      title: post.title,
      description: description,
      openGraph: {
        title: post.title,
        description: description,
        url: `https://daretunmise.com/writing/${post.slug}`,
        type: "article",
        publishedTime: post.date,
        images: [
          {
            url: "/og-image.jpg",
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: description,
      },
    };
  } catch (error) {
    return { title: "Post Not Found" };
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <WritingClientPage slug={slug} />;
}
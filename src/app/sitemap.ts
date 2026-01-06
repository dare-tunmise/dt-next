import { MetadataRoute } from 'next'
import { api } from '@/lib/api' // Import your API instance

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.daretunmise.com';

  // 1. Fetch all blogs/projects from your backend
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const response = await api.blogs.getAll(undefined, 1, 100);  // Or whatever your public fetch is
    const blogs = response.blogs;

    blogEntries = blogs.map((post: any) => ({
      // Map to the correct URL structure based on category
      url: `${baseUrl}/${post.category === 'writings' ? 'writing' : 'project'}/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.date),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Sitemap fetch failed", error);
  }

  // 2. Define your static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/writings`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/book`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // 3. Combine them
  return [...staticRoutes, ...blogEntries];
}
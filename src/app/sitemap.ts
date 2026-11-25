import { MetadataRoute } from 'next'
import { api } from '@/lib/api' // Import your API instance

// Rendered per request rather than prerendered. The route now throws when it
// cannot list posts (see below), and a prerendered route that throws fails the
// whole build — meaning any API outage would block every deploy, including one
// that has nothing to do with the API. Rendering on demand keeps a failure
// where it belongs: a 5xx on this one URL, at the moment it is requested.
//
// Crawlers fetch this rarely, so paying the upstream call each time is cheap
// next to shipping a wrong sitemap or a blocked deploy.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://daretunmise.com';

  // 1. Fetch all blogs/projects from your backend.
  //
  // This used to swallow the error and carry on with an empty list, which
  // emitted a valid sitemap containing only the five static routes below.
  // Google read one of those during an API outage and dropped every post from
  // its sitemap report — a truncated sitemap is not a missing sitemap, it is a
  // positive statement that those URLs are gone. With revalidate = 3600 the
  // truncated copy was then cached and served for an hour.
  //
  // Throwing instead returns a 5xx for /sitemap.xml. Google treats that as a
  // temporary fetch failure, keeps the last good sitemap and retries.
  let blogEntries: MetadataRoute.Sitemap = [];
  const response = await api.blogs.getAll(undefined, 1, 100, { revalidate: 3600 });
  const blogs = response.blogs;

  // An empty list means the API answered but had nothing to say. The site has
  // published posts, so treat that as a failure too rather than publishing a
  // sitemap that silently drops all of them.
  if (!Array.isArray(blogs) || blogs.length === 0) {
    throw new Error(
      'Sitemap: the blogs API returned no posts — refusing to emit a sitemap without them'
    );
  }

  blogEntries = blogs.map((post: any) => ({
    // Map to the correct URL structure based on category
    url: `${baseUrl}/${post.category === 'writings' ? 'writing' : 'project'}/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

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
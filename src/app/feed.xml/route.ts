import { api, Blog } from '@/lib/api';

// The feed reflects whatever is published right now, same as the rest of the
// site's reads.
export const dynamic = 'force-dynamic';

const SITE_URL = 'https://daretunmise.com';

const XML_ESCAPES: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  "'": '&apos;',
  '"': '&quot;',
};

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (char) => XML_ESCAPES[char]);

// Bodies are Quill HTML full of &nbsp; — reduce to plain text for the summary.
const toPlainText = (html = '') =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Quill base64-encodes pasted images straight into the body, and one post
// carries ~1.5MB that way. Readers poll hourly and can't use an inline blob
// anyway, so drop those; hosted images pass through untouched.
const stripDataImages = (html = '') =>
  html.replace(/<img[^>]+src=["']data:[^"']*["'][^>]*>/gi, '');

const itemFor = (post: Blog) => {
  const path = post.category === 'writings' ? 'writing' : 'project';
  const url = `${SITE_URL}/${path}/${post.slug}`;
  const summary = toPlainText(post.body).slice(0, 300);
  const published = new Date(post.date || post.createdAt || Date.now());

  return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${published.toUTCString()}</pubDate>
      <category>${escapeXml(post.category)}</category>
      <description>${escapeXml(summary)}${summary.length === 300 ? '…' : ''}</description>
      <content:encoded><![CDATA[${stripDataImages(post.body).replace(/]]>/g, ']]&gt;')}]]></content:encoded>
    </item>`;
};

export async function GET() {
  let posts: Blog[] = [];
  try {
    // getAll returns published posts only, already newest first.
    const data = await api.blogs.getAll(undefined, 1, 50);
    posts = data.blogs || [];
  } catch (error) {
    // An empty feed is better than a 500 — readers back off on errors.
    console.error('Feed fetch failed:', error);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Dare Tunmise</title>
    <link>${SITE_URL}</link>
    <description>Essays, software projects, and poetry by Dare Tunmise.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${posts.map(itemFor).join('\n')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      // Readers poll often; let a CDN absorb it.
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}

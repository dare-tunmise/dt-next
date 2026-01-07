import Link from 'next/link'

interface BlogCardProps {
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  readTime: string;
}

// const stripHtml = (html: string) => {
//   const tmp = document.createElement('div');
//   tmp.innerHTML = html;
//   return tmp.textContent || tmp.innerText || '';
// };

const stripHtml = (html: string) => {
  return html
    .replace(/<[^>]*>?/gm, '') 
    .replace(/&nbsp;/g, ' ')  
    .replace(/&amp;/g, '&');
};

const BlogCard = ({ title, excerpt, slug, date, readTime }: BlogCardProps) => {
  return (
    <article className="mb-8 pb-8 border-b border-border last:border-0">
      <Link href={`/writing/${slug}`} className="group">
        <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
          {title}
        </h3>
      </Link>
      <div className="text-sm text-accent mb-3">
        {date} / Read time: {readTime}
      </div>
      <div className="text-muted-foreground mb-3 leading-relaxed">
        {stripHtml(excerpt)}
      </div>
      <Link 
        href={`/writing/${slug}`}
        className="text-accent hover:underline text-sm"
      >
        Read more →
      </Link>
    </article>
  );
};

export default BlogCard;

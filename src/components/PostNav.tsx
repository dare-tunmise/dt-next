import Link from 'next/link';
import { PostLink } from '@/lib/api';
import { sectionLabel } from '@/lib/typography';

interface PostNavProps {
  prev?: PostLink | null;
  next?: PostLink | null;
  /** 'writing' or 'project' — neighbours are always in the same category. */
  basePath: string;
}

/**
 * Previous/next links at the foot of a post. "Previous" is the older post and
 * "next" is the newer one, so the newest post shows only a previous link and
 * the oldest shows only a next link.
 */
const PostNav = ({ prev, next, basePath }: PostNavProps) => {
  if (!prev && !next) return null;

  return (
    <nav className="mt-16 border-t border-border pt-8">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-12">
        {prev && (
          <Link href={`/${basePath}/${prev.slug}`} className="group sm:max-w-[45%]">
            <span className={sectionLabel}>← Previous</span>
            <span className="mt-2 block text-lg leading-snug transition-colors group-hover:text-accent">
              {prev.title}
            </span>
          </Link>
        )}

        {/* ml-auto keeps "Next" on the right even when there is no previous. */}
        {next && (
          <Link
            href={`/${basePath}/${next.slug}`}
            className="group sm:ml-auto sm:max-w-[45%] sm:text-right"
          >
            <span className={sectionLabel}>Next →</span>
            <span className="mt-2 block text-lg leading-snug transition-colors group-hover:text-accent">
              {next.title}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default PostNav;

import Link from 'next/link';

interface IndexRowProps {
  title: string;
  href: string;
  meta?: string;
}

// A single line in the home page index: title on the left, date (or other
// meta) on the right, separated by a hairline rule. Stacks on narrow screens.
const IndexRow = ({ title, href, meta }: IndexRowProps) => {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-1 border-t border-border py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
    >
      <span className="text-xl leading-snug transition-colors group-hover:text-accent sm:text-2xl">
        {title}
      </span>
      {meta && (
        <span className="shrink-0 text-sm italic text-muted-foreground">
          {meta}
        </span>
      )}
    </Link>
  );
};

export default IndexRow;

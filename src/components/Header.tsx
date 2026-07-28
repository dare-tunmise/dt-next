import Link from 'next/link'

// Masthead: wordmark left, nav right, sharing the same measure as page
// content so every left edge on the site lines up.
const Header = () => {
  return (
    <header className="mx-auto w-full max-w-3xl px-6 pt-16 sm:pt-20">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4">
        <Link
          href="/"
          className="font-mono text-sm uppercase tracking-[0.2em] transition-colors hover:text-accent"
        >
          dare tunmise.
        </Link>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/about" className="transition-colors hover:text-accent">
            About
          </Link>
          <Link href="/writings" className="transition-colors hover:text-accent">
            Writings
          </Link>
          <Link href="/projects" className="transition-colors hover:text-accent">
            Projects
          </Link>
          <Link href="/book" className="transition-colors hover:text-accent">
            Book
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

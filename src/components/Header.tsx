import Link from 'next/link'

const Header = () => {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-center gap-8 text-sm">
          <Link 
            href="/" 
            className="hover:text-accent transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className="hover:text-accent transition-colors"
          >
            About
          </Link>
          <Link 
            href="/writings" 
            className="hover:text-accent transition-colors"
          >
            Writings
          </Link>
          <Link 
            href="/projects" 
            className="hover:text-accent transition-colors"
          >
            Projects
          </Link>
          <Link 
            href="/book" 
            className="hover:text-accent transition-colors"
          >
            Book
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

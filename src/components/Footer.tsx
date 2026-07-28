const Footer = () => {
  return (
    <footer className="border-t border-border py-8 mt-16">
      <div className="mx-auto w-full max-w-3xl px-6 text-center text-sm text-muted-foreground">
        <p>© 2026 Dare Tunmise. All rights reserved.</p>
        <p className="mt-3">
          <a href="/feed.xml" className="transition-colors hover:text-accent">
            RSS
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

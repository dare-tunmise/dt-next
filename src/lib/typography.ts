// Shared type treatments for the index layout, so the home page, the
// writings archive and the projects archive stay in sync.

/** Small mono label above a list — section names, years. */
export const sectionLabel =
  "font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground";

/** Quiet "see everything" link at the foot of a list. */
export const moreLink =
  "font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-accent";

/** Page container: one measure for every page so left edges line up. */
export const pageFrame = "mx-auto w-full max-w-3xl px-6";

/** Large serif page title. */
export const pageTitle = "text-4xl font-normal leading-tight sm:text-5xl";

/** Italic serif line under a page title. */
export const standfirst = "mt-6 text-lg italic leading-relaxed text-muted-foreground";

/**
 * Uppercase the first letter. Applied to <title>, og:title and meta
 * description ONLY — a bare lowercase title reads as a broken page in a search
 * result, while on the page itself the lowercase is the house style and stays.
 */
export const sentenceCase = (text = '') =>
  text.replace(/^\s*([a-z])/, (_, c: string) => c.toUpperCase());

export const formatDate = (date?: string) =>
  new Date(date || '').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

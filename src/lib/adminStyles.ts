// The dashboard stays monospaced — it's an instrument, not a publication — but
// borrows the public site's structure: hairline rules instead of boxes, small
// uppercase micro-labels, and accent reserved for the one primary action.

/** Micro-label above a field, section or column. */
export const adminLabel =
  "font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground";

/** Secondary actions — text, not buttons, so they don't compete. */
export const quietAction =
  "font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-accent";

/** Destructive action: same weight as the others until you reach for it. */
export const dangerAction =
  "font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-destructive";

/** The single filled control per screen. */
export const primaryButton =
  "inline-block rounded bg-accent px-5 py-2.5 font-mono text-xs uppercase tracking-[0.15em] text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40";

/** Underline-only input, matching the rule language of the rest of the site. */
export const fieldInput =
  "w-full border-0 border-b border-border bg-transparent px-0 py-2 text-base text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-0";

/** Wider than the public measure — tables need the room. */
export const adminFrame = "mx-auto w-full max-w-5xl px-6";

interface StatTileProps {
  label: string;
  value: string | number;
  hint?: string;
}

// Headline numbers get tiles, not a chart — there's no shape to read in a
// single figure. A top rule instead of a box, matching the rest of the site.
const StatTile = ({ label, value, hint }: StatTileProps) => (
  <div className="border-t border-border pt-4">
    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
      {label}
    </div>
    <div className="mt-3 text-4xl tabular-nums text-foreground">{value}</div>
    {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
  </div>
);

export default StatTile;

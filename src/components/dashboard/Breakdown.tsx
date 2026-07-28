interface BreakdownProps {
  title: string;
  items: { name: string; count: number }[];
  empty?: string;
}

/**
 * Ranked list with a proportional bar behind each row.
 *
 * Deliberately one color for every row: the text label carries identity, so
 * there's no categorical palette to get wrong and nothing that depends on
 * telling hues apart.
 */
const Breakdown = ({ title, items, empty = 'Nothing yet' }: BreakdownProps) => {
  const max = Math.max(1, ...items.map((i) => i.count));

  return (
    <div className="border-t border-border pt-5">
      <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </h2>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.name}>
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="truncate text-foreground">{item.name}</span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {item.count}
                </span>
              </div>
              <div className="mt-1 h-1 w-full rounded-full bg-muted">
                <div
                  className="h-1 rounded-full bg-accent"
                  style={{ width: `${(item.count / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Breakdown;

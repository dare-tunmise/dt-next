"use client";

import { useState } from 'react';

interface Point {
  date: string;
  views: number;
  visitors: number;
}

/**
 * 30 days of views as vertical bars.
 *
 * Bars rather than a line: daily counts on a low-traffic blog are sparse, and a
 * line would draw continuity across days that had no readers at all. One series
 * only, so it needs no legend — the heading names it — and identity never rests
 * on color.
 */
const ViewsChart = ({ series }: { series: Point[] }) => {
  const [hover, setHover] = useState<number | null>(null);

  const max = Math.max(1, ...series.map((d) => d.views));
  const active = hover !== null ? series[hover] : null;

  const formatDay = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="border-t border-border pt-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Views · last 30 days
        </h2>
        {/* Reserve the row so hovering doesn't shift the chart below it. */}
        <div className="min-h-[1.25rem] text-sm text-foreground">
          {active && (
            <span className="tabular-nums">
              {formatDay(active.date)} — {active.views}{' '}
              {active.views === 1 ? 'view' : 'views'}, {active.visitors}{' '}
              {active.visitors === 1 ? 'visitor' : 'visitors'}
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 flex h-40 items-end gap-[2px]">
        {series.map((day, i) => {
          const heightPct = day.views === 0 ? 0 : (day.views / max) * 100;
          return (
            <div
              key={day.date}
              className="group relative flex h-full flex-1 cursor-default items-end"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              {/* Full-height hit target: bars are thin, pointers are not. */}
              <div className="absolute inset-0" aria-hidden="true" />
              {day.views > 0 ? (
                <div
                  className="w-full rounded-t bg-accent transition-opacity"
                  style={{
                    height: `${Math.max(heightPct, 4)}%`,
                    opacity: hover === null || hover === i ? 1 : 0.45,
                  }}
                />
              ) : (
                // Zero days still get a baseline tick, so gaps read as
                // "no readers" rather than "no data".
                <div className="h-px w-full bg-border" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{series.length > 0 && formatDay(series[0].date)}</span>
        <span>{series.length > 0 && formatDay(series[series.length - 1].date)}</span>
      </div>

      {/* Every value is also reachable as text, not only as a bar height. */}
      <details className="mt-4">
        <summary className="cursor-pointer text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-accent">
          View as table
        </summary>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-[0.15em] text-muted-foreground">
              <th className="py-1 font-normal">Date</th>
              <th className="py-1 text-right font-normal">Views</th>
              <th className="py-1 text-right font-normal">Visitors</th>
            </tr>
          </thead>
          <tbody>
            {series
              .filter((d) => d.views > 0)
              .map((d) => (
                <tr key={d.date} className="border-t border-border">
                  <td className="py-1">{formatDay(d.date)}</td>
                  <td className="py-1 text-right tabular-nums">{d.views}</td>
                  <td className="py-1 text-right tabular-nums">{d.visitors}</td>
                </tr>
              ))}
            {series.every((d) => d.views === 0) && (
              <tr>
                <td colSpan={3} className="py-2 text-muted-foreground">
                  No views in this window yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </details>
    </div>
  );
};

export default ViewsChart;

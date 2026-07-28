"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, AnalyticsSummary } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { adminLabel } from '@/lib/adminStyles';
import StatTile from './StatTile';

const rate = (part: number, whole: number) =>
  whole === 0 ? '—' : `${Math.round((part / whole) * 100)}%`;

export default function AnalyticsOverview() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    api.dashboard
      .getAnalytics()
      .then(setData)
      .catch(() =>
        toast({
          title: 'Error',
          description: 'Failed to load analytics',
          variant: 'destructive',
        })
      )
      .finally(() => setLoading(false));
  }, [toast]);

  if (loading) return <div className={adminLabel}>Loading</div>;
  if (!data) return null;

  const withViews = data.posts.filter((p) => p.views > 0);

  return (
    <div>
      <h1 className="text-2xl text-foreground">Analytics</h1>

      <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 lg:grid-cols-4">
        <StatTile label="Views" value={data.totals.views} hint="last 12 months" />
        <StatTile label="Visitors" value={data.totals.visitors} hint="unique readers" />
        <StatTile label="Read through" value={data.totals.engaged} hint="30s+ on page" />
        <StatTile
          label="Read rate"
          value={rate(data.totals.engaged, data.totals.views)}
          hint="of views"
        />
      </div>

      <div className="mt-16">
        <h2 className={adminLabel}>By post</h2>

        {withViews.length === 0 ? (
          <p className="mt-6 border-t border-border pt-6 text-sm text-muted-foreground">
            No views recorded yet. Open a post in another browser to see it appear.
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[34rem] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  <th className="pb-3 font-normal">Post</th>
                  <th className="pb-3 pl-4 text-right font-normal">Views</th>
                  <th className="pb-3 pl-4 text-right font-normal">Visitors</th>
                  <th className="pb-3 pl-4 text-right font-normal">Read</th>
                  <th className="pb-3 pl-4 text-right font-normal">Rate</th>
                </tr>
              </thead>
              <tbody>
                {withViews.map((post) => (
                  <tr key={post._id} className="border-t border-border">
                    <td className="py-3 pr-4">
                      <Link
                        href={`/admin/dashboard/analytics/${post._id}`}
                        className="text-foreground transition-colors hover:text-accent"
                      >
                        {post.title}
                      </Link>
                      {!post.published && (
                        <span className="ml-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3 pl-4 text-right tabular-nums">{post.views}</td>
                    <td className="py-3 pl-4 text-right tabular-nums">{post.visitors}</td>
                    <td className="py-3 pl-4 text-right tabular-nums">{post.engaged}</td>
                    <td className="py-3 pl-4 text-right tabular-nums text-muted-foreground">
                      {rate(post.engaged, post.views)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

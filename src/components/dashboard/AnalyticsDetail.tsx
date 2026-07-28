"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api, BlogAnalytics } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { adminLabel, quietAction } from '@/lib/adminStyles';
import StatTile from './StatTile';
import ViewsChart from './ViewsChart';
import Breakdown from './Breakdown';

const rate = (part: number, whole: number) =>
  whole === 0 ? '—' : `${Math.round((part / whole) * 100)}%`;

export default function AnalyticsDetail() {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<BlogAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    api.dashboard
      .getBlogAnalytics(id)
      .then(setData)
      .catch(() =>
        toast({
          title: 'Error',
          description: 'Failed to load analytics',
          variant: 'destructive',
        })
      )
      .finally(() => setLoading(false));
  }, [id, toast]);

  if (loading) return <div className={adminLabel}>Loading</div>;
  if (!data) return null;

  const href =
    data.blog.category === 'writings'
      ? `/writing/${data.blog.slug}`
      : `/project/${data.blog.slug}`;

  return (
    <div>
      <div>
        <Link href="/admin/dashboard/analytics" className={quietAction}>
          ← All analytics
        </Link>
        <h1 className="mt-4 text-2xl text-foreground">{data.blog.title}</h1>
        <Link
          href={href}
          className="mt-2 inline-block text-sm text-muted-foreground transition-colors hover:text-accent"
        >
          {href}
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 lg:grid-cols-4">
        <StatTile label="Views" value={data.totals.views} />
        <StatTile label="Visitors" value={data.totals.visitors} hint="unique readers" />
        <StatTile label="Read through" value={data.totals.engaged} hint="30s+ on page" />
        <StatTile
          label="Read rate"
          value={rate(data.totals.engaged, data.totals.views)}
          hint="of views"
        />
      </div>

      <div className="mt-16">
        <ViewsChart series={data.series} />
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-3">
        <Breakdown
          title="Countries"
          items={data.countries}
          empty="No country data yet"
        />
        <Breakdown
          title="Referrers"
          items={data.referrers}
          empty="No referrers yet"
        />
        <Breakdown title="Devices" items={data.devices} empty="No device data yet" />
      </div>
    </div>
  );
}

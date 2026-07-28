"use client";

import { useEffect } from 'react';
import { api } from '@/lib/api';
import { isTrackingDisabled } from '@/lib/tracking';

// Time a reader must actually be looking at the page before it counts as read
// rather than merely opened.
const ENGAGED_AFTER_MS = 30_000;

/**
 * Records a view on mount, then marks the visit "engaged" once the reader has
 * accumulated enough *visible* time — a page left open in a background tab
 * doesn't count. Renders nothing.
 *
 * Safe against React's double-invoked effects in development: the server keys
 * views on (visitor, slug, 30-minute bucket) with a unique index, so a repeat
 * call is discarded rather than double-counted.
 */
const ViewTracker = ({ slug }: { slug: string }) => {
  useEffect(() => {
    // Checked inside the effect: localStorage isn't available during SSR.
    if (!slug || isTrackingDisabled()) return;

    api.analytics.recordView(slug);

    let visibleMs = 0;
    let lastTick = Date.now();
    let sent = false;

    const tick = () => {
      const now = Date.now();
      if (document.visibilityState === 'visible') {
        visibleMs += now - lastTick;
      }
      lastTick = now;

      if (!sent && visibleMs >= ENGAGED_AFTER_MS) {
        sent = true;
        api.analytics.recordEngaged(slug);
        clearInterval(interval);
      }
    };

    const interval = setInterval(tick, 1_000);
    document.addEventListener('visibilitychange', tick);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [slug]);

  return null;
};

export default ViewTracker;

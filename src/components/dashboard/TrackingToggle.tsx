"use client";

import { useEffect, useState } from 'react';
import { isTrackingDisabled, setTrackingDisabled } from '@/lib/tracking';
import { adminLabel, quietAction } from '@/lib/adminStyles';

/**
 * Shows whether this browser is excluded from analytics, and lets you flip it.
 * Opening the dashboard sets the exclusion automatically, so this is mostly a
 * way to confirm it took effect — or to turn it off when testing tracking.
 */
export default function TrackingToggle() {
  // Starts null so nothing is rendered until localStorage has been read;
  // otherwise the first paint would assert the wrong state.
  const [excluded, setExcluded] = useState<boolean | null>(null);

  useEffect(() => {
    setExcluded(isTrackingDisabled());
  }, []);

  if (excluded === null) return null;

  const toggle = () => {
    setTrackingDisabled(!excluded);
    setExcluded(!excluded);
  };

  return (
    <div className="mt-16 border-t border-border pt-5">
      <h2 className={adminLabel}>This browser</h2>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {excluded
            ? 'Excluded from analytics. Your own visits are not counted here.'
            : 'Being counted. Your visits are appearing in the numbers above.'}
        </p>
        <button type="button" onClick={toggle} className={quietAction}>
          {excluded ? 'Start counting me' : 'Stop counting me'}
        </button>
      </div>
    </div>
  );
}

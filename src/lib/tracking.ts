/**
 * Per-browser opt-out from analytics.
 *
 * On a personal site the author is the most frequent visitor by a wide margin,
 * so without this the numbers mostly measure you. The flag is set automatically
 * the first time you open the dashboard in a browser, and can be toggled by
 * hand from the analytics page.
 *
 * Deliberately client-side: the beacon is fire-and-forget and sends no
 * credentials, so the server has no way to recognise you.
 */
const STORAGE_KEY = 'dt-analytics-opt-out';

export const isTrackingDisabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    // Private mode or blocked storage — fail open and just count the view.
    return false;
  }
};

export const setTrackingDisabled = (disabled: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    if (disabled) {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    /* nothing useful to do if storage is unavailable */
  }
};

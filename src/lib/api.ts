const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

/**
 * Carries the HTTP status so callers can tell "this post does not exist" from
 * "the API did not answer". A page that renders notFound() on both reports a
 * 404 to crawlers for a live post whenever the API blips, and Google drops the
 * URL from its index. Anything that is not a 404 must surface as a 5xx.
 */
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

/** Minimal shape returned for a neighbouring post. */
interface PostLink {
  title: string;
  slug: string;
}

interface Blog {
  _id?: string;
  title: string;
  slug: string;
  body: string;
  category: 'writings' | 'projects';
  date?: string;
  readTime?: string;
  githubLink?: string;
  published: boolean;
  author?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
  // Same-category neighbours, only present on the single-post endpoint.
  // prev is older, next is newer.
  prev?: PostLink | null;
  next?: PostLink | null;
}

interface BlogsResponse {
  blogs: Blog[];
  pagination?: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

interface CreateBlogData {
  title: string;
  body: string;
  category: 'writings' | 'projects';
  date?: string;
  githubLink?: string;
  published?: boolean;
}

interface AnalyticsTotals {
  views: number;
  visitors: number;
  engaged: number;
  lastViewedAt?: string | null;
}

interface AnalyticsPost {
  _id: string;
  title: string;
  slug: string;
  category: 'writings' | 'projects';
  published: boolean;
  views: number;
  visitors: number;
  engaged: number;
  lastViewedAt: string | null;
}

interface AnalyticsSummary {
  posts: AnalyticsPost[];
  totals: AnalyticsTotals;
}

interface BreakdownItem {
  name: string;
  count: number;
}

interface BlogAnalytics {
  blog: Pick<Blog, 'title' | 'slug' | 'category' | 'published' | 'date'>;
  totals: AnalyticsTotals;
  series: { date: string; views: number; visitors: number }[];
  countries: BreakdownItem[];
  referrers: BreakdownItem[];
  devices: BreakdownItem[];
}

interface UpdateBlogData {
  title?: string;
  body?: string;
  category?: 'writings' | 'projects';
  date?: string;
  githubLink?: string;
  published?: boolean;
}

// --- Research (SEC EDGAR) ---------------------------------------------------

/** One reported figure. `source` and `asOf` are always present by construction. */
interface FactPoint {
  value: number;
  unit: string;
  periodStart: string | null;
  periodEnd: string;
  fiscalYear: number | null;
  fiscalPeriod: string | null;
  form: string | null;
  filed: string | null;
  accession: string | null;
  /** Link to the filing this number came from. */
  source: string;
  asOf: string;
}

interface Metric {
  label: string;
  tag: string;
  unit: string;
  kind: 'duration' | 'instant';
  annual: FactPoint[];
  quarterly: FactPoint[];
  alternateTags?: string[];
  /** Company stopped reporting this line item — value is historical, not current. */
  stale?: boolean;
  staleNote?: string;
}

/** A figure lifted from an XBRL frame, cited back to its filing. */
interface ScreenFact {
  value: number;
  periodStart: string | null;
  periodEnd: string;
  accession: string;
  tag: string;
  source: string;
  asOf: string;
}

interface ScreenCandidate {
  cik: string;
  ticker: string;
  name: string;
  exchange: string | null;
  location: string | null;
  revenue: { current: ScreenFact; prior: ScreenFact; growth: number };
  netIncome: ScreenFact | null;
  netMargin: number | null;
  operatingIncome: ScreenFact | null;
  operatingMargin: number | null;
  operatingCashFlow: ScreenFact | null;
  stockholdersEquity: ScreenFact;
  debt: {
    longTerm: ScreenFact | null;
    shortTerm: ScreenFact | null;
    total: number;
    toEquity: number;
    /** False means no debt tag was filed at all — i.e. genuinely none. */
    reported: boolean;
  };
}

interface ScreenResult {
  criteria: {
    minRevenueGrowth: number;
    requireProfitable: boolean;
    requireOperatingProfit: boolean;
    maxDebtToEquity: number;
    minRevenue: number;
    maxRevenue: number;
    limit: number;
  };
  period: { current: string; prior: string };
  /** What each rule removed — a screen with 3 results is unreadable without it. */
  funnel: Record<string, number>;
  matched: number;
  sizeFilter: { type: string; note: string; maxRevenue: number };
  candidates: ScreenCandidate[];
  generatedAt: string;
}

interface CompanyResearch {
  profile: {
    ticker: string;
    cik: string;
    name: string;
    exchange: string | null;
    sic: string | null;
    sicDescription: string | null;
    fiscalYearEnd: string | null;
    stateOfIncorporation: string | null;
    formerNames: string[];
    source: string;
  };
  fundamentals: {
    ticker: string;
    entityName: string;
    metrics: Record<string, Metric>;
    missing: string[];
    retrievedAt: string;
  };
  filings: {
    count: number;
    filings: Array<{
      accession: string;
      form: string | null;
      filingDate: string | null;
      items: string | null;
      indexUrl: string;
      documentUrl: string | null;
    }>;
  };
}

export const api = {
  // Auth
  auth: {
    loginWithGoogle: () => {
      window.location.href = `${API_BASE_URL}/auth/google`;
    },
    logout: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Logout failed');
      return response.json();
    },
    getCurrentUser: async (): Promise<User> => {
      const response = await fetch(`${API_BASE_URL}/auth/user`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Not authenticated');
      const data = await response.json();
      return data.user; // Backend returns { user: {...} }
    },
  },

  // Public blogs
  blogs: {
    // Pass `revalidate` (seconds) for callers that would rather be cached than
    // instantaneous — the RSS feed, the sitemap, and every public page a
    // crawler reads. Without it the fetch is no-store, which forces the calling
    // route to be dynamic and prevents any CDN caching, so Googlebot pays a
    // full origin round-trip on every single crawl.
    getAll: async (
      category?: string,
      page = 1,
      limit = 10,
      opts?: { revalidate?: number }
    ): Promise<BlogsResponse> => {
      let url = `${API_BASE_URL}/api/blogs?page=${page}&limit=${limit}`;
      if (category) {
        url += `&category=${category}`;
      }
      const response = await fetch(
        url,
        opts?.revalidate
          ? { next: { revalidate: opts.revalidate } }
          : { cache: 'no-store' }
      );
      if (!response.ok) throw new Error('Failed to fetch blogs');
      return response.json();
    },
    getBySlug: async (slug: string, opts?: { revalidate?: number }): Promise<Blog> => {
      const response = await fetch(
        `${API_BASE_URL}/api/blogs/${slug}`,
        opts?.revalidate
          ? { next: { revalidate: opts.revalidate } }
          : { cache: 'no-store' }
      );
      if (!response.ok) {
        throw new ApiError(
          response.status,
          response.status === 404
            ? `No post with slug "${slug}"`
            : `Blog fetch failed for "${slug}" (HTTP ${response.status})`
        );
      }
      return response.json();
    },
    getByCategory: async (
      category: string,
      page = 1,
      limit = 10,
      opts?: { revalidate?: number }
    ): Promise<BlogsResponse> => {
      const response = await fetch(
        `${API_BASE_URL}/api/blogs/category/${category}?page=${page}&limit=${limit}`,
        opts?.revalidate
          ? { next: { revalidate: opts.revalidate } }
          : { cache: 'no-store' }
      );
      if (!response.ok) throw new Error('Failed to fetch blogs');
      return response.json();
    },
    search: async (searchTerm: string, page = 1, limit = 10): Promise<BlogsResponse> => {
      const response = await fetch(
        `${API_BASE_URL}/api/blogs?search=${encodeURIComponent(searchTerm)}&page=${page}&limit=${limit}`
      );
      if (!response.ok) throw new Error('Failed to search blogs');
      return response.json();
    },
  },

  // Research (protected) — live company data from SEC EDGAR
  research: {
    /** Cold run takes ~9s; frames are cached server-side for 12h after that. */
    screen: async (params?: Record<string, string | number | boolean>): Promise<ScreenResult> => {
      const query = new URLSearchParams(
        Object.entries(params || {}).map(([k, v]) => [k, String(v)])
      ).toString();
      const response = await fetch(
        `${API_BASE_URL}/api/research/screen${query ? `?${query}` : ''}`,
        { credentials: 'include' }
      );
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Screen failed');
      }
      return response.json();
    },
    getCompany: async (ticker: string): Promise<CompanyResearch> => {
      const response = await fetch(
        `${API_BASE_URL}/api/research/company/${encodeURIComponent(ticker)}`,
        { credentials: 'include' }
      );
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || `Lookup failed for ${ticker}`);
      }
      return response.json();
    },
  },

  // Dashboard (protected)
  dashboard: {
    getAllBlogs: async (status?: 'published' | 'draft', category?: string): Promise<BlogsResponse> => {
      let url = `${API_BASE_URL}/api/dashboard/blogs?limit=100`;
      if (status) url += `&status=${status}`;
      if (category) url += `&category=${category}`;
      
      const response = await fetch(url, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch blogs');
      return response.json();
    },
    createBlog: async (blog: CreateBlogData) => {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(blog),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create blog');
      }
      return response.json();
    },
    updateBlog: async (id: string, blog: UpdateBlogData) => {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(blog),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update blog');
      }
      return response.json();
    },
    deleteBlog: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/blogs/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete blog');
      }
      return response.json();
    },
    togglePublish: async (id: string, published: boolean) => {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/blogs/${id}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ published }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to toggle publish');
      }
      return response.json();
    },
    getAnalytics: async (): Promise<AnalyticsSummary> => {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/analytics`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
    getBlogAnalytics: async (id: string): Promise<BlogAnalytics> => {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/analytics/${id}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
  },

  // Analytics beacons (public, fire-and-forget)
  analytics: {
    // The Referer on this POST would be the post page itself, so the original
    // referrer is passed explicitly in the body.
    recordView: (slug: string) => beacon('/api/views', slug),
    recordEngaged: (slug: string) => beacon('/api/views/engage', slug),
  },
};

// Analytics must never surface an error to a reader, so this swallows
// everything. keepalive lets it survive a navigation away from the page.
const beacon = (path: string, slug: string) => {
  try {
    void fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* never break the page for analytics */
  }
};

// Export types for use in components
export type {
  User, Blog, PostLink, BlogsResponse, CreateBlogData, UpdateBlogData,
  AnalyticsSummary, BlogAnalytics, AnalyticsPost, BreakdownItem,
  CompanyResearch, Metric, FactPoint,
  ScreenResult, ScreenCandidate, ScreenFact,
};

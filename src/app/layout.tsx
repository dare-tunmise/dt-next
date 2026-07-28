
import "./global.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Metadata } from "next";

const SITE_URL = "https://www.daretunmise.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Dare Tunmise — Software Engineer, Writer & Poet",
    template: "%s | Dare Tunmise",
  },
  description:
    "Dare Tunmise — software engineer, writer, and poet. Read essays, browse software projects, and explore the poetry collection \"A Failed Attempt at Undoing Memories.\"",
  applicationName: "Dare Tunmise",
  keywords: [
    "Dare Tunmise",
    "Tunmise Dare",
    "software engineer",
    "writer",
    "poet",
    "AI engineer",
    "backend engineer",
    "African poetry",
    "A Failed Attempt at Undoing Memories",
    "African Poetry Book Fund",
    "essays",
    "portfolio",
  ],
  authors: [{ name: "Dare Tunmise", url: SITE_URL }],
  creator: "Dare Tunmise",
  publisher: "Dare Tunmise",
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Dare Tunmise",
    title: "Dare Tunmise — Software Engineer, Writer & Poet",
    description:
      "Software engineer, writer, and poet. Essays, software projects, and the poetry collection \"A Failed Attempt at Undoing Memories.\"",
    locale: "en_US",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Dare Tunmise" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Dare_Tunmise",
    creator: "@Dare_Tunmise",
    title: "Dare Tunmise — Software Engineer, Writer & Poet",
    description:
      "Software engineer, writer, and poet. Essays, projects, and a poetry collection.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  manifest: '/site.webmanifest',
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Dare Tunmise",
  alternateName: "Tunmise Dare",
  url: SITE_URL,
  image: `${SITE_URL}/og-image.jpg`,
  jobTitle: "Software Engineer & Writer",
  description:
    "Software engineer, writer, and poet. Builds backend systems and AI-powered tools, writes essays, and authored the poetry collection \"A Failed Attempt at Undoing Memories.\"",
  sameAs: [
    "https://x.com/Dare_Tunmise",
    "https://www.linkedin.com/in/dare-tunmise-47524519a/",
    "https://github.com/dare-tunmise",
  ],
};

// NOTE: the WebSite schema lives on the home page, not here. Google reads the
// site name from home-page markup only, and repeating it on every route makes
// it a weaker signal rather than a stronger one.

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {/* Declared here rather than via metadata.alternates.types: every page
            sets its own `alternates.canonical`, and Next replaces that object
            wholesale instead of merging, which drops the feed link. */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Dare Tunmise"
          href="/feed.xml"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
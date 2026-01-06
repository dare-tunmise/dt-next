
import "./global.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Metadata } from "next";


export const metadata: Metadata = {
  metadataBase: new URL('https://www.daretunmise.com'),

  title: {
    default: "Dare Tunmise - Writer & Software Engineer",
    template: "%s | Dare Tunmise"
  },
  description: "Writer || Software Engineer",
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
  authors: [{ name: "Dare Tunmise" }],
  openGraph: {
    type: "website",
    url: "https://www.daretunmise.com/",
    siteName: "Dare Tunmise",
    images: [{ url: "/og-image.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@Dare_Tunmise",
  },
  manifest: '/site.webmanifest',

};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
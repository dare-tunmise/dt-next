/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // If you use images from external domains
  images: {
    domains: ['your-api-domain.com'],
  },
};

export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
      },
    ],
  },

  async rewrites() {
    return [
      // Only proxy the routes that actually live on the Express server.
      // /api/auth/* stays untouched so better-auth's own Next.js route handler works.
      {
        source: '/api/donation-requests/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/donation-requests/:path*`,
      },
      {
        source: '/api/users/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/:path*`,
      },
      {
        source: '/api/dashboard/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/dashboard/:path*`,
      },
    ];
  },
};

export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don't advertise the framework (SEO audit: "X-Powered-By header is sent")
  poweredByHeader: false,

  // One host only: afterrender.com 301 -> www.afterrender.com (same path and query), so Google
  // doesn't see two copies of every page. Matches only the bare host, so www can never loop.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'afterrender.com' }],
        destination: 'https://www.afterrender.com/:path*',
        // Explicit 301 (permanent: true would send 308; Google treats both the same, audit tools ask for 301)
        statusCode: 301,
      },
    ];
  },

  experimental: {
    // Inline the (small) CSS into the HTML so it doesn't block first paint
    inlineCss: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Iska matlab Cloudinary ke saare paths allowed hain
      },
    ],
  },
};

export default nextConfig;
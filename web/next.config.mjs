/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Add remote hosts used for tenant assets (e.g., band logos, media)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
};

export default nextConfig;

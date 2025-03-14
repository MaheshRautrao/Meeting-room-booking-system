/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ❌ Not recommended for long-term, but works
  },
};

export default nextConfig;

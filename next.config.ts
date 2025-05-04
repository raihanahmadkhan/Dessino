import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com', 'randomuser.me'],
  },
  output: 'standalone'
};

export default nextConfig;

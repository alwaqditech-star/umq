/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@umq/shared", "framer-motion"],
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {eslint: {
//     ignoreDuringBuilds: true, // Ignore ESLint warnings and errors during builds
//   }};
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during production builds
  },
};

export default nextConfig;


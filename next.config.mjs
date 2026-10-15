/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Event fliers are uploaded through a server action (up to 4 MB, see saveEvent).
    serverActions: { bodySizeLimit: "5mb" },
  },
};

export default nextConfig;

// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "querify-frontend.vercel.app",
        pathname: "/images/blackminiNG.png",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_DB_URL: process.env.NEXT_PUBLIC_DB_URL,
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
    NEXT_PUBLIC_NEO4J_URL: process.env.NEXT_PUBLIC_NEO4J_URL,
  },
};

export default nextConfig;

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
};

export default nextConfig;

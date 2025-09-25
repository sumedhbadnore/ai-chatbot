import type { NextConfig } from "next";

const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*", // all routes, including /embed
        headers: [
          // Old XFO is ignored when CSP has frame-ancestors, but set it permissive to avoid proxies injecting DENY.
          { key: "X-Frame-Options", value: "ALLOWALL" },
          {
            key: "Content-Security-Policy",
            // Add your exact portfolio origin(s) here:
            // If you have a custom domain, use that instead of the vercel.app URL.
            value:
              "frame-ancestors 'self' https://portfolio-sumedh-badnores-projects.vercel.app http://localhost:3000;",
          },
        ],
      },
    ];
  },
  reactStrictMode: true,
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: true,
    viewTransition: true,
    ppr: true,
    cacheComponents: true,
    browserDebugInfoInTerminal: true,
    clientSegmentCache: true,
    devtoolSegmentExplorer: true,
    mdxRs: true,
    turbopackPersistentCaching: true,
    optimizeRouterScrolling: true,
  },
  images: {
    qualities: [25, 50, 75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "assets.chanhdai.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "yash.reactopia.me",
        port: "",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/yashm20.png",
      },
    ],
  },
  transpilePackages: ["next-mdx-remote"],
  async rewrites() {
    return [
      {
        source: "/blog/:slug.md",
        destination: "/blog.md/:slug",
      },
      {
        source: "/mhj-my00/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/mhj-my00/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/mhj-my00/flags",
        destination: "https://us.i.posthog.com/flags",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default nextConfig;

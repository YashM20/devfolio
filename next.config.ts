import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typedRoutes: true,
  transpilePackages: ["next-mdx-remote"],
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  experimental: {
    viewTransition: true,
    mdxRs: true,
    turbopackFileSystemCacheForBuild: true,
    turbopackRustReactCompiler: true,
  },
  logging: {
    browserToTerminal: true,
  },
  compiler:
    process.env.NODE_ENV === "production"
      ? {
          removeConsole: {
            exclude: ["error"],
          },
        }
      : undefined,
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
};

export default nextConfig;

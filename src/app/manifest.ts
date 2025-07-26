import type { MetadataRoute } from "next";

import { SITE_INFO } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    short_name: SITE_INFO.name,
    name: SITE_INFO.name,
    description: SITE_INFO.description,
    icons: [
      {
        src: "https://ui-avatars.com/api/?name=YM&size=32&background=111111&color=fff&bold=true&format=png",
        type: "image/png",
        sizes: "16x16 32x32",
        purpose: "any",
      },
      {
        src: "https://ui-avatars.com/api/?name=Yash+Mahajan&size=192&background=111111&color=fff&bold=true",
        type: "image/png",
        sizes: "192x192",
        purpose: "any",
      },
      {
        src: "https://ui-avatars.com/api/?name=Yash+Mahajan&size=512&background=111111&color=fff&bold=true",
        type: "image/png",
        sizes: "512x512",
        purpose: "any",
      },
      {
        src: "https://ui-avatars.com/api/?name=YM&size=512&background=111111&color=fff&bold=true&rounded=true",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable",
      },
    ],
    id: "/?utm_source=pwa",
    start_url: "/?utm_source=pwa",
    display: "standalone",
    scope: "/",
    screenshots: [
      {
        src: "/images/ss/screenshot-mobile-dark.webp",
        type: "image/webp",
        sizes: "440x956",
        form_factor: "narrow",
      },
      {
        src: "/images/ss/screenshot-mobile-light.webp",
        type: "image/webp",
        sizes: "440x956",
        form_factor: "narrow",
      },
      {
        src: "/images/ss/screenshot-desktop-dark.webp",
        type: "image/webp",
        sizes: "1920x1080",
        form_factor: "wide",
      },
      {
        src: "/images/ss/screenshot-desktop-light.webp",
        type: "image/webp",
        sizes: "1920x1080",
        form_factor: "wide",
      },
    ],
  };
}

"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useIsClient } from "@/hooks/use-is-client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Robust helper to parse the images prop from any format (Array, comma-separated string, JSON string)
function parseImagesProp(images: string[] | string | undefined): string[] {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  if (typeof images === "string") {
    const trimmed = images.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return trimmed.split(",").flatMap((src) => {
      const trimmedSrc = src.trim();
      return trimmedSrc ? [trimmedSrc] : [];
    });
  }
  return [];
}

const aspectMap = {
  video: "aspect-video w-full",
  portrait: "aspect-[9/16] w-full max-w-[320px] mx-auto",
  square: "aspect-square w-full max-w-[480px] mx-auto",
  auto: "aspect-auto w-full",
};

export type AspectType = "video" | "portrait" | "square" | "auto";

function getAspectSizes(aspect: AspectType = "video"): string {
  if (aspect === "portrait") {
    return "(max-width: 360px) 100vw, 320px";
  }
  if (aspect === "square") {
    return "(max-width: 520px) 100vw, 480px";
  }
  return "(max-width: 768px) 100vw, 768px";
}

// 1. Image Component with Outlines & Captions
export function ProjectImage({
  src,
  alt,
  caption,
  className,
  aspect = "video",
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  aspect?: AspectType;
}) {
  const aspectClass = aspectMap[aspect] || aspectMap.video;

  return (
    <figure className={cn("my-6 overflow-hidden rounded-2xl border border-edge bg-muted/20 p-2", aspect === "portrait" && "max-w-[336px] mx-auto", className)}>
      <div className={cn("relative overflow-hidden rounded-lg bg-muted", aspectClass)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={getAspectSizes(aspect)}
          className="object-cover"
          unoptimized
        />
        <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10 dark:ring-white/10" />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground font-mono">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// 2. Video Component
export function ProjectVideo({
  src,
  caption,
  className,
  aspect = "video",
}: {
  src: string;
  caption?: string;
  className?: string;
  aspect?: AspectType;
}) {
  const aspectClass = aspectMap[aspect] || aspectMap.video;

  return (
    <figure className={cn("my-6 overflow-hidden rounded-2xl border border-edge bg-muted/20 p-2", aspect === "portrait" && "max-w-[336px] mx-auto", className)}>
      <div className={cn("relative overflow-hidden rounded-lg bg-muted", aspectClass)}>
        <video
          src={src}
          controls
          aria-label={caption || "Project video"}
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10 dark:ring-white/10" />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground font-mono">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// 3. Iframe Embed Component (Figma, YouTube, Live Links)
export function ProjectIframe({
  src,
  title,
  className,
}: {
  src: string;
  title?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative my-6 aspect-video w-full overflow-hidden rounded-2xl border border-edge bg-muted/20 p-2", className)}>
      <div className="relative h-full w-full overflow-hidden rounded-lg bg-background">
        <iframe
          src={src}
          title={title || "Project Embed"}
          className="h-full w-full border-0 bg-background"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
        />
        <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10 dark:ring-white/10" />
      </div>
    </div>
  );
}

// 4. Grid Container for Collages or side-by-side elements
export function ProjectGrid({
  children,
  cols = 2,
  className,
}: {
  children: React.ReactNode;
  cols?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "my-6 grid gap-4",
        cols === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2",
        className
      )}
    >
      {children}
    </div>
  );
}

// 5. Image Carousel / Slider
function SliderCarousel({
  images,
  aspect = "video",
}: {
  images: string[];
  aspect?: AspectType;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const aspectClass = aspectMap[aspect] || aspectMap.video;

  return (
    <div className={cn("relative my-6 overflow-hidden rounded-2xl border border-edge bg-muted/20 p-2", aspect === "portrait" && "max-w-[336px] mx-auto")}>
      <div className={cn("overflow-hidden rounded-lg bg-muted", aspectClass)} ref={emblaRef}>
        <div className="flex h-full w-full">
          {images.map((src) => (
            <div className="relative h-full w-full min-w-0 flex-[0_0_100%]" key={src}>
              <Image
                src={src}
                alt="Slide"
                fill
                sizes={getAspectSizes(aspect)}
                className="object-cover"
                unoptimized
              />
              <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10 dark:ring-white/10" />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-edge bg-background/80 text-foreground backdrop-blur-xs transition-[background-color,border-color,transform] duration-150 ease-out hover:bg-background active:scale-[0.96] before:absolute before:-inset-2 before:content-['']"
        aria-label="Previous slide"
      >
        <ChevronLeft className="size-4" />
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-edge bg-background/80 text-foreground backdrop-blur-xs transition-[background-color,border-color,transform] duration-150 ease-out hover:bg-background active:scale-[0.96] before:absolute before:-inset-2 before:content-['']"
        aria-label="Next slide"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

export function ProjectSlider({
  images,
  aspect = "video",
}: {
  images?: string[] | string;
  aspect?: AspectType;
}) {
  const imageList = parseImagesProp(images);
  const isMounted = useIsClient();

  const aspectClass = aspectMap[aspect] || aspectMap.video;

  if (!isMounted) {
    return (
      <div className={cn("relative my-6 overflow-hidden rounded-2xl border border-edge bg-muted/20 p-2", aspect === "portrait" && "max-w-[336px] mx-auto")}>
        <div className={cn("overflow-hidden rounded-lg bg-muted", aspectClass)}>
          <div className="flex h-full w-full">
            <div className="relative w-full h-full bg-muted">
              {imageList[0] && (
                <Image
                  src={imageList[0]}
                  alt="Slide 1 Preview"
                  fill
                  sizes={getAspectSizes(aspect)}
                  className="object-cover"
                  unoptimized
                />
              )}
              <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10 dark:ring-white/10" />
            </div>
          </div>
        </div>

        <div className="absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-edge bg-background/80 text-foreground/50 backdrop-blur-xs pointer-events-none">
          <ChevronLeft className="size-4" />
        </div>

        <div className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-edge bg-background/80 text-foreground/50 backdrop-blur-xs pointer-events-none">
          <ChevronRight className="size-4" />
        </div>
      </div>
    );
  }

  return <SliderCarousel images={imageList} aspect={aspect} />;
}

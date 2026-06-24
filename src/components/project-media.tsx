"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
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
    return trimmed.split(",").map((src) => src.trim()).filter(Boolean);
  }
  return [];
}

// 1. Image Component with Outlines & Captions
export function ProjectImage({
  src,
  alt,
  caption,
  className,
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={cn("my-6 overflow-hidden rounded-2xl border border-edge bg-muted/20 p-2", className)}>
      <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
        <Image
          src={src}
          alt={alt}
          fill
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
}: {
  src: string;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={cn("my-6 overflow-hidden rounded-2xl border border-edge bg-muted/20 p-2", className)}>
      <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
        <video
          src={src}
          controls
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
function SliderCarousel({ images }: { images?: string[] | string }) {
  const imageList = parseImagesProp(images);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative my-6 overflow-hidden rounded-2xl border border-edge bg-muted/20 p-2">
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {imageList.map((src, index) => (
            <div className="relative aspect-video min-w-0 flex-[0_0_100%]" key={index}>
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
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

export function ProjectSlider({ images }: { images?: string[] | string }) {
  const imageList = parseImagesProp(images);
  console.log("DEBUG [ProjectSlider] imageList parsed:", imageList);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Render static preview layout on server/SSR to avoid Layout Shift (CLS)
    // and prevent executing Embla hooks before mounting on the client.
    return (
      <div className="relative my-6 overflow-hidden rounded-2xl border border-edge bg-muted/20 p-2">
        <div className="overflow-hidden rounded-lg">
          <div className="flex">
            <div className="relative aspect-video min-w-0 flex-[0_0_100%] bg-muted">
              {imageList[0] && (
                <Image
                  src={imageList[0]}
                  alt="Slide 1 Preview"
                  fill
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

  return <SliderCarousel images={imageList} />;
}

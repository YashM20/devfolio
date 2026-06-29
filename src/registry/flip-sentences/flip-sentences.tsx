"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export function FlipSentences({
  className,
  sentences,
}: {
  className?: string;
  sentences: string[];
}) {
  const [currentSentence, setCurrentSentence] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let activeInterval: NodeJS.Timeout | null = null;

    const startAnimation = () => {
      activeInterval = setInterval(() => {
        setCurrentSentence((prev) => (prev + 1) % sentences.length);
      }, 3500);
      intervalRef.current = activeInterval;
    };

    startAnimation();

    const abortController = new AbortController();
    const { signal } = abortController;

    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.visibilityState !== "visible" && activeInterval) {
          clearInterval(activeInterval); // Clear the interval when the tab is not visible
          activeInterval = null;
          intervalRef.current = null;
        } else if (document.visibilityState === "visible") {
          setCurrentSentence((prev) => (prev + 1) % sentences.length); // Show the next sentence immediately
          startAnimation(); // Restart the interval when the tab becomes visible
        }
      },
      { signal }
    );

    return () => {
      if (activeInterval) {
        clearInterval(activeInterval);
      }
      abortController.abort();
    };
  }, [sentences]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.p
        key={`current-sentence-${currentSentence}`}
        className={cn(
          "text-muted-foreground select-none text-balance font-mono text-sm",
          className
        )}
        initial={{
          y: 8,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        exit={{
          y: -8,
          opacity: 0,
        }}
        transition={{
          duration: 0.3,
          ease: "linear",
        }}
      >
        {sentences[currentSentence]}
      </m.p>
    </AnimatePresence>
  );
}

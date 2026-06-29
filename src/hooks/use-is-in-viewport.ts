import type React from "react";
import { useEffect, useState } from "react";

export function useIsInViewport(ref: React.RefObject<HTMLElement | null>) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current || typeof window === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(([entry]) =>
      setIsIntersecting(entry.isIntersecting)
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
}

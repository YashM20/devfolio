/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-require-imports */
"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useSpring } from "motion/react";
import * as m from "motion/react-m";

import { cn } from "@/lib/utils";

// Spring config for smooth tooltip movement
const springConfig = { stiffness: 100, damping: 20 };

export interface TooltipBoxProps {
  /** X position in pixels (relative to container) */
  x: number;
  /** Y position in pixels (relative to container) */
  y: number;
  /** Whether the tooltip is visible */
  visible: boolean;
  /** Container DOM node for portal rendering */
  containerNode: HTMLDivElement | null;
  /** Container width for flip detection */
  containerWidth: number;
  /** Container height for bounds clamping */
  containerHeight: number;
  /** Offset from the target position */
  offset?: number;
  /** Custom class name */
  className?: string;
  /** Tooltip content */
  children: React.ReactNode;
  /** Override left position (bypasses internal calculation) */
  left?: number | ReturnType<typeof useSpring>;
  /** Override top position (bypasses internal calculation) */
  top?: number | ReturnType<typeof useSpring>;
  /** Force flip direction (for custom positioning) */
  flipped?: boolean;
}

export function TooltipBox({
  x,
  y,
  visible,
  containerNode,
  containerWidth,
  containerHeight,
  offset = 16,
  className = "",
  children,
  left: leftOverride,
  top: topOverride,
  flipped: flippedOverride,
}: TooltipBoxProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tw, setTw] = useState(180);
  const [th, setTh] = useState(80);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const animatedLeft = useSpring(x + offset, springConfig);
  const animatedTop = useSpring(y, springConfig);

  const shouldFlipX = x + tw + offset > containerWidth;
  const targetX = shouldFlipX ? x - offset - tw : x + offset;
  const targetY = Math.max(
    offset,
    Math.min(y - th / 2, containerHeight - th - offset)
  );

  if (leftOverride === undefined) {
    animatedLeft.set(targetX);
  }
  if (topOverride === undefined) {
    animatedTop.set(targetY);
  }

  useLayoutEffect(() => {
    if (!(visible && tooltipRef.current)) {
      return;
    }
    const el = tooltipRef.current;
    const w = el.offsetWidth;
    const h = el.offsetHeight;

    let nextTw = tw;
    let nextTh = th;
    let sizeChanged = false;

    if (w > 0 && w !== tw) {
      nextTw = w;
      sizeChanged = true;
    }
    if (h > 0 && h !== th) {
      nextTh = h;
      sizeChanged = true;
    }

    if (sizeChanged) {
      setTw(nextTw);
      setTh(nextTh);
    }

    const flip = x + nextTw + offset > containerWidth;
    const ty = Math.max(
      offset,
      Math.min(y - nextTh / 2, containerHeight - nextTh - offset)
    );
    if (leftOverride === undefined) {
      animatedLeft.set(flip ? x - offset - nextTw : x + offset);
    }
    if (topOverride === undefined) {
      animatedTop.set(ty);
    }
  }, [
    visible,
    x,
    y,
    containerWidth,
    containerHeight,
    offset,
    leftOverride,
    topOverride,
    animatedLeft,
    animatedTop,
    tw,
    th,
  ]);

  const prevFlipRef = useRef(shouldFlipX);
  const [flipKey, setFlipKey] = useState(0);

  useEffect(() => {
    if (prevFlipRef.current !== shouldFlipX) {
      setFlipKey((k) => k + 1);
      prevFlipRef.current = shouldFlipX;
    }
  }, [shouldFlipX]);

  const finalLeft = leftOverride ?? animatedLeft;
  const finalTop = topOverride ?? animatedTop;
  const isFlipped = flippedOverride ?? shouldFlipX;
  const transformOrigin = isFlipped ? "right top" : "left top";

  const container = containerNode;
  if (!(mounted && container)) {
    return null;
  }

  const { createPortal } = require("react-dom") as typeof import("react-dom");

  if (!visible) {
    return null;
  }

  return createPortal(
    <m.div
      animate={{ opacity: 1 }}
      className={cn("pointer-events-none absolute z-50", className)}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      ref={tooltipRef}
      style={{ left: finalLeft, top: finalTop }}
      transition={{ duration: 0.1 }}
    >
      <m.div
        animate={{ scale: 1, opacity: 1, x: 0 }}
        className="min-w-35 overflow-hidden rounded-lg bg-chart-tooltip-background text-chart-tooltip-foreground shadow-lg ring-1 ring-foreground/10 backdrop-blur-md dark:ring-foreground/15"
        initial={{ scale: 0.85, opacity: 0, x: isFlipped ? 20 : -20 }}
        key={flipKey}
        style={{ transformOrigin }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {children}
      </m.div>
    </m.div>,
    container
  );
}

TooltipBox.displayName = "TooltipBox";

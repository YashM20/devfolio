"use client";

import { useId, useState } from "react";
import { curveNatural } from "@visx/curve";
import { LinePath } from "@visx/shape";
import { useMotionValue, useSpring, useTransform } from "motion/react";
import * as m from "motion/react-m";

import { useChart } from "./chart-context";
import { chartCssVars } from "./chart-theme";
import { ChartRevealClip } from "./chart-reveal-clip";

// CurveFactory type - simplified version compatible with visx
// biome-ignore lint/suspicious/noExplicitAny: d3 curve factory type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CurveFactory = any;

export interface LineProps {
  /** Key in data to use for y values */
  dataKey: string;
  /** Stroke color. Default: var(--chart-line-primary) */
  stroke?: string;
  /** Stroke width. Default: 2.5 */
  strokeWidth?: number;
  /** Curve function. Default: curveNatural */
  curve?: CurveFactory;
  /** Whether to animate the line. Default: true */
  animate?: boolean;
  /** Whether to fade edges with gradient. Default: true */
  fadeEdges?: boolean;
  /** Whether to show highlight segment on hover. Default: true */
  showHighlight?: boolean;
}

export function Line({
  dataKey,
  stroke = chartCssVars.linePrimary,
  strokeWidth = 2.5,
  curve = curveNatural,
  animate = true,
  fadeEdges = true,
  showHighlight = true,
}: LineProps) {
  const {
    data,
    xScale,
    yScale,
    innerHeight,
    innerWidth,
    tooltipData,
    selection,
    isLoaded,
    enterTransition,
    revealEpoch,
    xAccessor,
  } = useChart();

  const [pathElement, setPathElement] = useState<SVGPathElement | null>(null);
  const pathLengthMV = useMotionValue(0);

  // Unique gradient ID for this line
  const id = useId();
  const gradientId = `line-gradient-${dataKey}-${id}`;

  // Springs for smooth highlight animation (both offset AND segment length)
  const springConfig = { stiffness: 180, damping: 28 };
  const offsetSpring = useSpring(0, springConfig);
  const segmentLengthSpring = useSpring(0, springConfig);

  // Calculate segment bounds and update springs inline during render
  const segmentBounds = (() => {
    if (!pathElement) {
      return { startLength: 0, segmentLength: 0 };
    }

    const pathLength = pathElement.getTotalLength();
    pathLengthMV.set(pathLength);

    if (pathLength === 0) {
      return { startLength: 0, segmentLength: 0 };
    }

    // Helper: Binary search to find path length at a given X coordinate
    const findLengthAtX = (targetX: number): number => {
      let low = 0;
      let high = pathLength;
      const tolerance = 0.5;

      while (high - low > tolerance) {
        const mid = (low + high) / 2;
        const point = pathElement.getPointAtLength(mid);
        if (point.x < targetX) {
          low = mid;
        } else {
          high = mid;
        }
      }
      return (low + high) / 2;
    };

    // Selection takes priority over hover
    if (selection?.active) {
      const startLength = findLengthAtX(selection.startX);
      const endLength = findLengthAtX(selection.endX);
      return {
        startLength,
        segmentLength: endLength - startLength,
      };
    }

    if (!tooltipData) {
      return { startLength: 0, segmentLength: 0 };
    }

    const idx = tooltipData.index;
    const startIdx = Math.max(0, idx - 1);
    const endIdx = Math.min(data.length - 1, idx + 1);

    const startPoint = data[startIdx];
    const endPoint = data[endIdx];
    if (!(startPoint && endPoint)) {
      return { startLength: 0, segmentLength: 0 };
    }

    const startX = xScale(xAccessor(startPoint)) ?? 0;
    const endX = xScale(xAccessor(endPoint)) ?? 0;

    const startLength = findLengthAtX(startX);
    const endLength = findLengthAtX(endX);

    return {
      startLength,
      segmentLength: endLength - startLength,
    };
  })();

  // Set spring targets directly during rendering
  offsetSpring.set(-segmentBounds.startLength);
  segmentLengthSpring.set(segmentBounds.segmentLength);

  const animatedDasharray = useTransform(
    [segmentLengthSpring, pathLengthMV],
    ([latestSegment, latestLength]) => `${latestSegment} ${latestLength}`
  );

  // Get y value for a data point
  const getY = (d: Record<string, unknown>) => {
    const value = d[dataKey];
    return typeof value === "number" ? (yScale(value) ?? 0) : 0;
  };

  const isHovering = tooltipData !== null || selection?.active === true;

  return (
    <>
      {/* Gradient definition for fading edges */}
      {fadeEdges && (
        <defs>
          <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" style={{ stopColor: stroke, stopOpacity: 0 }} />
            <stop offset="15%" style={{ stopColor: stroke, stopOpacity: 1 }} />
            <stop offset="85%" style={{ stopColor: stroke, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: stroke, stopOpacity: 0 }} />
          </linearGradient>
        </defs>
      )}

      {/* Clip path for grow animation - unique per line */}
      {animate && data.length > 1 ? (
        <defs>
          <ChartRevealClip
            clipPathId={`grow-clip-${dataKey}`}
            enterTransition={enterTransition}
            height={innerHeight + 20}
            revealEpoch={revealEpoch ?? 0}
            targetWidth={innerWidth}
          />
        </defs>
      ) : null}

      <g
        clipPath={
          animate && data.length > 1 ? `url(#grow-clip-${dataKey})` : undefined
        }
      >
        <m.g
          animate={{ opacity: isHovering && showHighlight ? 0.3 : 1 }}
          initial={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <LinePath
            curve={curve}
            data={data}
            innerRef={setPathElement}
            stroke={fadeEdges ? `url(#${gradientId})` : stroke}
            strokeLinecap="round"
            strokeWidth={strokeWidth}
            x={(d) => xScale(xAccessor(d)) ?? 0}
            y={getY}
          />
        </m.g>
      </g>

      {/* Highlight segment on hover */}
      {showHighlight && isHovering && isLoaded && pathElement && (
        <m.path
          animate={{ opacity: 1 }}
          d={pathElement.getAttribute("d") || ""}
          exit={{ opacity: 0 }}
          fill="none"
          initial={{ opacity: 0 }}
          stroke={stroke}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          style={{
            strokeDasharray: animatedDasharray,
            strokeDashoffset: offsetSpring,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      )}
    </>
  );
}

Line.displayName = "Line";

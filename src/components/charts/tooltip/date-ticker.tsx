/* eslint-disable react-hooks/refs */
"use client";

import { useEffect, useRef } from "react";
import { useSpring } from "motion/react";
import * as m from "motion/react-m";

const TICKER_ITEM_HEIGHT = 24;

export interface DateTickerProps {
  currentIndex: number;
  labels: string[];
  visible: boolean;
}

export function DateTicker({ currentIndex, labels, visible }: DateTickerProps) {
  // Parse labels into month and day parts
  const parsedLabels = labels.map((label, index) => {
    const parts = label.split(" ");
    const month = parts[0] || "";
    const day = parts[1] || "";
    return { month, day, full: label, key: `${label}::${index}` };
  });

  // Month segments: one entry per consecutive run (Jan → Feb → …), keyed by start index
  const monthSegments = (() => {
    const segments: { month: string; key: string; startIndex: number }[] = [];

    parsedLabels.forEach((label, index) => {
      const prev = segments.at(-1);
      if (!prev || prev.month !== label.month) {
        segments.push({
          month: label.month,
          key: `${label.month}-${index}`,
          startIndex: index,
        });
      }
    });

    return segments;
  })();

  // Index into monthSegments for the current data point
  const currentMonthIndex = (() => {
    if (currentIndex < 0 || currentIndex >= parsedLabels.length) {
      return 0;
    }
    for (let i = monthSegments.length - 1; i >= 0; i--) {
      const segment = monthSegments[i];
      if (segment && segment.startIndex <= currentIndex) {
        return i;
      }
    }
    return 0;
  })();

  // Animated Y offsets
  const dayY = useSpring(0, { stiffness: 400, damping: 35 });
  const monthY = useSpring(0, { stiffness: 400, damping: 35 });

  useEffect(() => {
    dayY.set(-currentIndex * TICKER_ITEM_HEIGHT);
  }, [currentIndex, dayY]);

  useEffect(() => {
    if (currentMonthIndex >= 0) {
      monthY.set(-currentMonthIndex * TICKER_ITEM_HEIGHT);
    }
  }, [currentMonthIndex, monthY]);

  if (!visible || labels.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-full bg-zinc-900 px-4 py-1 text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900">
      <div className="relative h-6 overflow-hidden">
        <div className="flex items-center justify-center gap-1">
          {/* Month stack */}
          <div className="relative h-6 overflow-hidden">
            <m.div className="flex flex-col" style={{ y: monthY }}>
              {monthSegments.map((segment) => (
                <div
                  className="flex h-6 shrink-0 items-center justify-center"
                  key={segment.key}
                >
                  <span className="text-sm font-medium whitespace-nowrap">
                    {segment.month}
                  </span>
                </div>
              ))}
            </m.div>
          </div>

          {/* Day stack */}
          <div className="relative h-6 overflow-hidden">
            <m.div className="flex flex-col" style={{ y: dayY }}>
              {parsedLabels.map((label) => (
                <div
                  className="flex h-6 shrink-0 items-center justify-center"
                  key={label.key}
                >
                  <span className="text-sm font-medium whitespace-nowrap">
                    {label.day}
                  </span>
                </div>
              ))}
            </m.div>
          </div>
        </div>
      </div>
    </div>
  );
}

DateTicker.displayName = "DateTicker";

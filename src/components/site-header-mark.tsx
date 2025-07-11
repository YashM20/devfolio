"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ChanhDaiMark } from "./chanhdai-mark";

export function SiteHeaderMark() {
  const pathname = usePathname();
  return pathname === "/" ? <ChanhDaiMarkMotion /> : <ChanhDaiMark />;
}

function ChanhDaiMarkMotion() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const distanceRef = useRef(160);

  useMotionValueEvent(scrollY, "change", (latestValue) => {
    setVisible(latestValue >= distanceRef.current);
  });

  useEffect(() => {
    const coverMark = document.getElementById("js-cover-mark");
    if (!coverMark) return;

    distanceRef.current = calcDistance(coverMark);

    const resizeObserver = new ResizeObserver(() => {
      distanceRef.current = calcDistance(coverMark);
    });
    resizeObserver.observe(coverMark);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const color = "currentColor";

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 600"
      initial={{
        opacity: 0,
        transform: "translateY(8px)",
      }}
      animate={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(8px)",
      }}
      transition={{ duration: 0.3 }}
      preserveAspectRatio="xMidYMid slice"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <pattern
          id="pppixelate-pattern"
          width="120"
          height="60"
          patternUnits="userSpaceOnUse"
          patternTransform="translate(1 0) scale(42) rotate(0)"
          shapeRendering="crispEdges"
        >
          <rect width="1" height="1" x="2" y="3" fill={color} />
          <rect width="1" height="1" x="8" y="3" fill={color} />
          <rect width="1" height="1" x="11" y="3" fill={color} />
          <rect width="1" height="1" x="12" y="3" fill={color} />
          <rect width="1" height="1" x="17" y="3" fill={color} />
          <rect width="1" height="1" x="18" y="3" fill={color} />
          <rect width="1" height="1" x="1" y="4" fill={color} />
          <rect width="1" height="1" x="2" y="4" fill={color} />
          <rect width="1" height="1" x="3" y="4" fill={color} />
          <rect width="1" height="1" x="7" y="4" fill={color} />
          <rect width="1" height="1" x="8" y="4" fill={color} />
          <rect width="1" height="1" x="9" y="4" fill={color} />
          <rect width="1" height="1" x="11" y="4" fill={color} />
          <rect width="1" height="1" x="12" y="4" fill={color} />
          <rect width="1" height="1" x="17" y="4" fill={color} />
          <rect width="1" height="1" x="18" y="4" fill={color} />
          <rect width="1" height="1" x="1" y="5" fill={color} />
          <rect width="1" height="1" x="2" y="5" fill={color} />
          <rect width="1" height="1" x="3" y="5" fill={color} />
          <rect width="1" height="1" x="4" y="5" fill={color} />
          <rect width="1" height="1" x="6" y="5" fill={color} />
          <rect width="1" height="1" x="7" y="5" fill={color} />
          <rect width="1" height="1" x="8" y="5" fill={color} />
          <rect width="1" height="1" x="9" y="5" fill={color} />
          <rect width="1" height="1" x="11" y="5" fill={color} />
          <rect width="1" height="1" x="12" y="5" fill={color} />
          <rect width="1" height="1" x="13" y="5" fill={color} />
          <rect width="1" height="1" x="16" y="5" fill={color} />
          <rect width="1" height="1" x="17" y="5" fill={color} />
          <rect width="1" height="1" x="18" y="5" fill={color} />
          <rect width="1" height="1" x="1" y="6" fill={color} />
          <rect width="1" height="1" x="2" y="6" fill={color} />
          <rect width="1" height="1" x="4" y="6" fill={color} />
          <rect width="1" height="1" x="5" y="6" fill={color} />
          <rect width="1" height="1" x="6" y="6" fill={color} />
          <rect width="1" height="1" x="8" y="6" fill={color} />
          <rect width="1" height="1" x="9" y="6" fill={color} />
          <rect width="1" height="1" x="12" y="6" fill={color} />
          <rect width="1" height="1" x="13" y="6" fill={color} />
          <rect width="1" height="1" x="14" y="6" fill={color} />
          <rect width="1" height="1" x="15" y="6" fill={color} />
          <rect width="1" height="1" x="16" y="6" fill={color} />
          <rect width="1" height="1" x="17" y="6" fill={color} />
          <rect width="1" height="1" x="1" y="7" fill={color} />
          <rect width="1" height="1" x="2" y="7" fill={color} />
          <rect width="1" height="1" x="5" y="7" fill={color} />
          <rect width="1" height="1" x="8" y="7" fill={color} />
          <rect width="1" height="1" x="9" y="7" fill={color} />
          <rect width="1" height="1" x="13" y="7" fill={color} />
          <rect width="1" height="1" x="14" y="7" fill={color} />
          <rect width="1" height="1" x="15" y="7" fill={color} />
          <rect width="1" height="1" x="16" y="7" fill={color} />
          <rect width="1" height="1" x="1" y="8" fill={color} />
          <rect width="1" height="1" x="2" y="8" fill={color} />
          <rect width="1" height="1" x="8" y="8" fill={color} />
          <rect width="1" height="1" x="9" y="8" fill={color} />
          <rect width="1" height="1" x="14" y="8" fill={color} />
          <rect width="1" height="1" x="15" y="8" fill={color} />
          <rect width="1" height="1" x="1" y="9" fill={color} />
          <rect width="1" height="1" x="2" y="9" fill={color} />
          <rect width="1" height="1" x="8" y="9" fill={color} />
          <rect width="1" height="1" x="9" y="9" fill={color} />
          <rect width="1" height="1" x="14" y="9" fill={color} />
          <rect width="1" height="1" x="15" y="9" fill={color} />
          <rect width="1" height="1" x="1" y="10" fill={color} />
          <rect width="1" height="1" x="2" y="10" fill={color} />
          <rect width="1" height="1" x="8" y="10" fill={color} />
          <rect width="1" height="1" x="9" y="10" fill={color} />
          <rect width="1" height="1" x="14" y="10" fill={color} />
          <rect width="1" height="1" x="15" y="10" fill={color} />
          <rect width="1" height="1" x="1" y="11" fill={color} />
          <rect width="1" height="1" x="2" y="11" fill={color} />
          <rect width="1" height="1" x="8" y="11" fill={color} />
          <rect width="1" height="1" x="9" y="11" fill={color} />
          <rect width="1" height="1" x="14" y="11" fill={color} />
          <rect width="1" height="1" x="15" y="11" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pppixelate-pattern)" />
    </motion.svg>
  );
}

const calcDistance = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  const scrollTop = document.documentElement.scrollTop;
  const headerHeight = 56;
  return scrollTop + rect.top + rect.height - headerHeight;
};

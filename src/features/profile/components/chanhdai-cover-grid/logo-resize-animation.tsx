"use client";

import { motion } from "motion/react";
import { useState } from "react";

import { ChanhDaiMark } from "@/components/chanhdai-mark";

const variants = {
  show: {
    opacity: 1,
  },
  hide: {
    opacity: 0,
  },
};

/**
 * Animates a logo resizing sequence with visual border and label effects.
 *
 * The logo smoothly transitions its width from `maxWidth` to `minWidth` and back, displaying animated borders and a label showing the current width and half-width. The animation plays once when the component enters the viewport.
 *
 * @param minWidth - The minimum width of the logo during the animation (default: 128)
 * @param maxWidth - The maximum width of the logo during the animation (default: 160)
 * @returns A React element containing the animated logo and effects
 */
export function LogoResizeAnimation({
  minWidth = 128,
  maxWidth = 160,
}: {
  minWidth?: number;
  maxWidth?: number;
}) {
  const [width, setWidth] = useState(maxWidth);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <motion.div
      className="relative"
      initial={{ width: maxWidth }}
      whileInView={{ width: [maxWidth, minWidth, maxWidth] }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: 0.4 }}
      onUpdate={(latest) => {
        setWidth(latest.width as number);
      }}
      onAnimationComplete={() => {
        setIsEnd(true);
      }}
    >
      <motion.div
        variants={variants}
        animate={isEnd ? "hide" : "show"}
        transition={{
          duration: 0.6,
          delay: 0.2,
        }}
        className="*:bg-background absolute -bottom-px -left-px -right-px -top-px border border-blue-500 *:absolute *:size-[9px] *:border *:border-blue-500 dark:border-zinc-600 dark:*:border-zinc-600"
      >
        <div className="-left-[5px] -top-[5px]" />
        <div className="-right-[5px] -top-[5px]" />
        <div className="-bottom-[5px] -left-[5px]" />
        <div className="-bottom-[5px] -right-[5px]" />
      </motion.div>

      <motion.div
        variants={variants}
        animate={isEnd ? "hide" : "show"}
        transition={{
          duration: 0.6,
          delay: 0.2,
        }}
        className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full transform whitespace-nowrap rounded-sm bg-blue-600 px-1 font-mono text-sm text-white dark:bg-zinc-600"
      >
        {Math.round(width)}x{Math.round(width / 2)}
      </motion.div>

      <ChanhDaiMark className="size-full text-black dark:text-white" />
    </motion.div>
  );
}

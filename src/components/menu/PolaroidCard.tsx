"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { MouseEvent } from "react";

import type { Drink } from "@/lib/types";

interface PolaroidCardProps {
  drink: Drink;
  left: string;
  top: string;
  rotate: number;
  zIndex: number;
  onSelect: () => void;
  expanded?: boolean;
}

export function PolaroidCard({
  drink,
  left,
  top,
  rotate,
  zIndex,
  onSelect,
  expanded = false,
}: PolaroidCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 180, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 180, damping: 18 });
  const tiltX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const tiltY = useTransform(springX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (event: MouseEvent<HTMLButtonElement>) => {
    if (expanded) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.button
      type="button"
      layoutId={`polaroid-${drink.id}`}
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="polaroid-card absolute w-[168px] cursor-pointer border-0 bg-transparent p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f4a582]"
      style={{
        left: expanded ? "50%" : left,
        top: expanded ? "50%" : top,
        zIndex: expanded ? 50 : zIndex,
        rotate: expanded ? 0 : rotate,
        x: expanded ? "-50%" : 0,
        y: expanded ? "-50%" : 0,
      }}
      whileHover={expanded ? undefined : { y: -10, scale: 1.04 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      <motion.div
        style={{
          rotateX: expanded ? 0 : tiltX,
          rotateY: expanded ? 0 : tiltY,
          transformPerspective: 800,
        }}
      >
        <div className="rounded-sm bg-[#faf8f5] p-3 pb-10 shadow-warm-lg">
          <div
            className="flex h-36 items-center justify-center overflow-hidden"
            style={{
              background: `linear-gradient(145deg, ${drink.color}55, #fdf8f0)`,
            }}
          >
            <div
              className="relative h-24 w-[72px] rounded-b-2xl rounded-t-md border border-white/70"
              style={{ backgroundColor: `${drink.liquidColor}99` }}
            >
              <div className="absolute -top-2 left-1/2 h-3 w-14 -translate-x-1/2 rounded-full bg-white/90" />
              <div className="absolute -right-0.5 top-4 h-12 w-1 rotate-12 rounded-full bg-white/80" />
            </div>
          </div>
          <p className="mt-3 text-center font-[family-name:var(--font-quicksand)] text-sm font-semibold text-[#4a3f35]">
            {drink.name}
          </p>
        </div>
      </motion.div>
    </motion.button>
  );
}

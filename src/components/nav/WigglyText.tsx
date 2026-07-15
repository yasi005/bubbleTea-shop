"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface WigglyTextProps {
  text: string;
  className?: string;
}

export function WigglyText({ text, className = "" }: WigglyTextProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className={`inline-flex ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={text}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="inline-block"
          animate={
            hovered
              ? {
                  y: [0, -3, 0, 2, 0],
                  transition: {
                    duration: 1.6,
                    repeat: Infinity,
                    delay: index * 0.04,
                    ease: "easeInOut",
                  },
                }
              : { y: 0 }
          }
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

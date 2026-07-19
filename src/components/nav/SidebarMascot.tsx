"use client";

import { motion } from "framer-motion";

export function SidebarMascot() {
  return (
    <motion.div
      layoutId="sidebar-mascot"
      className="pointer-events-none absolute -top-7 left-1/2 z-20 -translate-x-1/2"
      transition={{ type: "spring", stiffness: 420, damping: 16, mass: 0.6 }}
    >
      <motion.div
        initial={false}
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex flex-col items-center"
      >
        <span className="text-2xl leading-none" role="img" aria-label="Sleepy cafe cat">
        </span>
        <span className="mt-0.5 text-[8px]">z z z</span>
      </motion.div>
    </motion.div>
  );
}

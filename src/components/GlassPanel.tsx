"use client";

import type { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

export function GlassPanel({ children, className = "" }: GlassPanelProps) {
  return (
    <div
      className={`glass-panel rounded-[1.35rem] p-5 sm:rounded-3xl sm:p-7 lg:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

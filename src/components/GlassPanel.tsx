"use client";

import type { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

export function GlassPanel({ children, className = "" }: GlassPanelProps) {
  return (
    <div className={`glass-panel rounded-3xl p-6 sm:p-8 ${className}`}>
      {children}
    </div>
  );
}

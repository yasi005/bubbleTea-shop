"use client";

import { CafeReceiptSidebar } from "@/components/layout/CafeReceiptSidebar";
import { MenuCounterProvider } from "@/context/MenuCounterContext";
import { VibeProvider } from "@/context/VibeContext";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <VibeProvider>
      <MenuCounterProvider>
        <div className="flex min-h-screen">
          <CafeReceiptSidebar />
          <div className="relative flex min-h-screen flex-1 flex-col overflow-hidden max-[900px]:pb-20">
            {children}
          </div>
        </div>
      </MenuCounterProvider>
    </VibeProvider>
  );
}

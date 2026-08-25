"use client";

import { CafeFooter } from "@/components/layout/CafeFooter";
import { CafeReceiptSidebar } from "@/components/layout/CafeReceiptSidebar";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { MenuCounterProvider } from "@/context/MenuCounterContext";
import { VibeProvider } from "@/context/VibeContext";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <VibeProvider>
      <MenuCounterProvider>
        <div className="flex h-dvh overflow-hidden">
          <CafeReceiptSidebar />
          <div
            className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden max-[900px]:pb-[calc(4.25rem+env(safe-area-inset-bottom))]"
          >
            <main className="relative min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
              {children}
            </main>
            <CafeFooter />
          </div>
          <MobileTabBar />
        </div>
      </MenuCounterProvider>
    </VibeProvider>
  );
}

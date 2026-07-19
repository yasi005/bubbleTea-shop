"use client";

import { CafeFooter } from "@/components/layout/CafeFooter";
import { CafeReceiptSidebar } from "@/components/layout/CafeReceiptSidebar";
import { MenuCounterProvider } from "@/context/MenuCounterContext";
import { VibeProvider } from "@/context/VibeContext";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <VibeProvider>
      <MenuCounterProvider>
        <div className="flex h-screen overflow-hidden">
          <CafeReceiptSidebar />
          <div className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden max-[900px]:pb-20">
            <main className="relative min-h-0 flex-1 overflow-y-auto">
              {children}
            </main>
            <CafeFooter />
          </div>
        </div>
      </MenuCounterProvider>
    </VibeProvider>
  );
}

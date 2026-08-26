"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { CafeFooter } from "@/components/layout/CafeFooter";
import { CafeReceiptSidebar } from "@/components/layout/CafeReceiptSidebar";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { MenuCounterProvider } from "@/context/MenuCounterContext";
import { VibeProvider } from "@/context/VibeContext";
import { useIsMobileShell } from "@/hooks/useMediaQuery";

function isImmersiveMobileRoute(pathname: string): boolean {
  return pathname === "/" || pathname === "/brew" || pathname.startsWith("/menu");
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobileShell();
  const lockMainScroll = isMobile && isImmersiveMobileRoute(pathname);

  useEffect(() => {
    if (!lockMainScroll) {
      return;
    }
    const { body, documentElement } = document;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverflow = documentElement.style.overflow;
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";
    return () => {
      body.style.overflow = prevBodyOverflow;
      documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [lockMainScroll]);

  return (
    <VibeProvider>
      <MenuCounterProvider>
        <div className="flex h-dvh overflow-hidden">
          <CafeReceiptSidebar />
          <div className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden">
            <main
              className={`relative min-h-0 flex-1 ${
                lockMainScroll
                  ? "overflow-hidden overscroll-none touch-none"
                  : "overflow-y-auto overscroll-y-contain max-[900px]:pb-[var(--mobile-tab-inset)]"
              }`}
            >
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

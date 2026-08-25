"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useShop } from "@/context/ShopContext";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/favorites", label: "Favorites" },
];

export function Navbar() {
  const pathname = usePathname();
  const { userName, basketCount } = useShop();

  return (
    <header className="sticky top-0 z-40 border-b border-[#ead9c8]/60 bg-[#fdf8f0]/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-[family-name:var(--font-bubble)] text-xl font-bold tracking-tight text-[#4a3f35]"
        >
          Bubble Tea Boutique
        </Link>

        <div className="hidden items-center gap-8 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-[#c4842f]"
                  : "text-[#6b5d4f] hover:text-[#c4842f]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {userName ? (
            <span className="hidden text-sm text-[#6b5d4f] md:inline">
              Cozy cups for{" "}
              <span className="font-semibold text-[#c4842f]">{userName}</span>
            </span>
          ) : null}

          <Link
            href="/basket"
            className="relative rounded-full bg-[#f5ebe0] px-4 py-2 text-sm font-medium text-[#4a3f35] transition hover:bg-[#ead9c8]"
          >
            Basket
            {basketCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#f4a582] text-xs font-bold text-white">
                {basketCount}
              </span>
            ) : null}
          </Link>
        </div>
      </nav>
    </header>
  );
}

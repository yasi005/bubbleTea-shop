export const NAV_LINKS = [
  { href: "/", label: "The Porch", emoji: "🏠" },
  { href: "/menu", label: "The Fridge", emoji: "🧋" },
  { href: "/about", label: "Our Diary", emoji: "📖" },
  { href: "/basket", label: "My Tote Bag", emoji: "🧺" },
] as const;

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(href);
}

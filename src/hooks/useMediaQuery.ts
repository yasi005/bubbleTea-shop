"use client";

import { useEffect, useState } from "react";

/** Matches the site's phone/tablet shell breakpoint (bottom tab bar). */
export const MOBILE_SHELL_QUERY = "(max-width: 900px)";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export function useIsMobileShell(): boolean {
  return useMediaQuery(MOBILE_SHELL_QUERY);
}

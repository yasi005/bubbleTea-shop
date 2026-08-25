"use client";

interface ToteCupThumbProps {
  liquidColor: string;
  accentColor: string;
  custom?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { wrap: "h-14 w-11", cup: "inset-x-[18%] bottom-[8%] top-[22%]", pearls: "h-1 w-1" },
  md: { wrap: "h-[4.5rem] w-14", cup: "inset-x-[16%] bottom-[7%] top-[20%]", pearls: "h-1.5 w-1.5" },
  lg: { wrap: "h-24 w-[4.5rem]", cup: "inset-x-[15%] bottom-[6%] top-[18%]", pearls: "h-1.5 w-1.5" },
} as const;

/** Lightweight CSS cup — keeps the drink as the visual hero without a 3D canvas. */
export function ToteCupThumb({
  liquidColor,
  accentColor,
  custom = false,
  size = "md",
}: ToteCupThumbProps) {
  const s = SIZES[size];

  return (
    <div
      className={`relative shrink-0 ${s.wrap}`}
      aria-hidden
    >
      <div
        className="absolute inset-0 rounded-[1.1rem]"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${accentColor}33 0%, transparent 70%)`,
        }}
      />

      {/* Lid */}
      <div className="absolute left-1/2 top-[6%] z-20 h-[12%] w-[78%] -translate-x-1/2 rounded-full bg-[#fff8f0] shadow-[0_1px_2px_rgba(61,56,48,0.12)]" />
      <div className="absolute left-1/2 top-[2%] z-20 h-[8%] w-[34%] -translate-x-1/2 rounded-full bg-[#f4a582]/90" />

      {/* Glass body */}
      <div
        className={`absolute z-10 overflow-hidden rounded-b-[1.15rem] rounded-t-[0.35rem] border border-white/70 bg-white/35 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)] ${s.cup}`}
      >
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: custom ? "72%" : "82%",
            background: `linear-gradient(180deg, ${liquidColor}cc 0%, ${liquidColor} 55%, ${liquidColor}ee 100%)`,
          }}
        />
        <div className="absolute inset-y-[18%] left-[12%] w-[14%] rounded-full bg-white/35" />
        <div className="absolute bottom-[14%] left-1/2 flex -translate-x-1/2 gap-[3px]">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`pearl-3d rounded-full ${s.pearls}`}
              style={{ opacity: 0.75 + (i % 2) * 0.1 }}
            />
          ))}
        </div>
      </div>

      {/* Straw */}
      <div
        className="absolute right-[22%] top-[4%] z-30 h-[42%] w-[7%] origin-bottom rotate-[14deg] rounded-full"
        style={{ backgroundColor: accentColor }}
      />
    </div>
  );
}

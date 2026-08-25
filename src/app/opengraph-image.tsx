import { ImageResponse } from "next/og";

import { DRINKS } from "@/lib/drinks";

/**
 * The social cover card, generated at build time.
 *
 * Link crawlers (LinkedIn, Discord, iMessage, portfolio embeds) fetch a static
 * image — they never run WebGL — so the real 3D cup can't appear here. This
 * draws a flat stand-in from the same palette the shop uses, which keeps the
 * card on-brand without shipping a screenshot that goes stale every redesign.
 */
export const alt = "Bubble Tea Boutique — a cozy 3D tea shop";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 90px",
          background: "linear-gradient(150deg, #fdf8f0 0%, #f7efe2 55%, #f3e3d3 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Left — the pitch */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 620 }}>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "#b8956a",
              fontWeight: 700,
            }}
          >
            Open Daily · Est. 2026
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 82,
              fontWeight: 800,
              color: "#3d3830",
              lineHeight: 1.05,
              marginTop: 24,
            }}
          >
            Bubble Tea
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 82,
              fontWeight: 800,
              color: "#f4a582",
              lineHeight: 1.05,
            }}
          >
            Boutique
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 29,
              color: "#6b5d4f",
              marginTop: 28,
              lineHeight: 1.4,
            }}
          >
            Pour it, shake it, seal it, sip it — a cozy tea shop with real
            physics, running at 60fps.
          </div>

          {/* Flavor swatches, straight from the menu data */}
          <div style={{ display: "flex", gap: 14, marginTop: 40 }}>
            {DRINKS.map((drink) => (
              <div
                key={drink.id}
                style={{
                  display: "flex",
                  width: 46,
                  height: 46,
                  borderRadius: 23,
                  background: drink.color,
                  border: "3px solid #ffffff",
                }}
              />
            ))}
          </div>
        </div>

        {/* Right — a flat cup, drawn with boxes */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* straw */}
          <div
            style={{
              display: "flex",
              width: 26,
              height: 150,
              background: "#e8956f",
              borderRadius: 13,
              marginBottom: -34,
              marginLeft: 70,
            }}
          />
          {/* lid */}
          <div
            style={{
              display: "flex",
              width: 300,
              height: 34,
              background: "#f6ede0",
              border: "5px solid #3d3830",
              borderRadius: 17,
            }}
          />
          {/* cup body */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              width: 264,
              height: 320,
              marginTop: 8,
              border: "5px solid #3d3830",
              borderRadius: "26px 26px 60px 60px",
              background: "#fffaf3",
              overflow: "hidden",
            }}
          >
            {/* milk tea */}
            <div
              style={{
                display: "flex",
                width: "100%",
                height: 214,
                background: "linear-gradient(180deg, #d8a45f 0%, #b87333 100%)",
                position: "relative",
              }}
            />
            {/* pearls */}
            <div
              style={{
                display: "flex",
                position: "absolute",
                bottom: 26,
                left: 26,
                gap: 10,
              }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    background: "#2f2620",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

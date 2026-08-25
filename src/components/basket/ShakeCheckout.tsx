"use client";

import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { useVibe } from "@/context/VibeContext";

interface ShakeCheckoutProps {
  open: boolean;
  onComplete: () => void;
  onCancel: () => void;
}

export function ShakeCheckout({ open, onComplete, onCancel }: ShakeCheckoutProps) {
  const { playShake, isNight } = useVibe();
  const [mix, setMix] = useState(0);
  const shakeEnergy = useRef(0);
  const lastTouchX = useRef<number | null>(null);

  useEffect(() => {
    if (!open) {
      setMix(0);
      shakeEnergy.current = 0;
      lastTouchX.current = null;
    }
  }, [open]);

  const bumpMix = useCallback(
    (delta: number) => {
      if (mix >= 1) {
        return;
      }
      shakeEnergy.current += Math.abs(delta);
      playShake(Math.abs(delta) / 30);
      if (shakeEnergy.current > 8) {
        setMix((prev) => Math.min(1, prev + 0.045));
        shakeEnergy.current = 0;
      }
    },
    [mix, playShake],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!open || mix >= 1) {
        return;
      }
      bumpMix(event.movementX);
    },
    [open, mix, bumpMix],
  );

  const handleTouchMove = useCallback(
    (event: React.TouchEvent) => {
      if (!open || mix >= 1) {
        return;
      }
      const x = event.touches[0]?.clientX;
      if (x == null) {
        return;
      }
      if (lastTouchX.current != null) {
        bumpMix(x - lastTouchX.current);
      }
      lastTouchX.current = x;
    },
    [open, mix, bumpMix],
  );

  const handleTouchEnd = () => {
    lastTouchX.current = null;
  };

  useEffect(() => {
    if (mix >= 1) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.55 },
        colors: ["#F4A582", "#C4842F", "#A8D5BA", "#F4B8C1", "#F5D76E"],
      });
      window.setTimeout(onComplete, 600);
    }
  }, [mix, onComplete]);

  const milkOpacity = 1 - mix;
  const teaOpacity = mix;
  const blended = `color-mix(in srgb, #F4B8C1 ${(1 - mix) * 100}%, #A8D5BA ${mix * 100}%)`;
  const wobble = Math.sin(mix * Math.PI * 6) * (1 - mix) * 10;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#3d3830]/45 p-4 backdrop-blur-sm sm:p-6"
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <motion.div
            initial={{ scale: 0.94, y: 18 }}
            animate={{ scale: 1, y: 0 }}
            className={`w-full max-w-sm rounded-[1.75rem] border p-6 text-center shadow-[0_20px_50px_-20px_rgba(61,56,48,0.45)] sm:p-8 ${
              isNight
                ? "border-[#5c4f42] bg-[#2f2a26]/95 text-[#f5ebe0]"
                : "border-white/50 bg-[#fdf8f0]/92 text-[#3d3830]"
            }`}
            style={{ backdropFilter: "blur(16px)" }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#b8956a]">
              Final swirl
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-bubble)] text-xl font-bold sm:text-2xl">
              Shake to mix
            </h2>
            <p
              className={`mx-auto mt-2 max-w-[18rem] text-sm ${
                isNight ? "text-[#d4c4b0]" : "text-[#6b5d4f]"
              }`}
            >
              Wiggle side to side until the layers settle into one cozy pastel.
            </p>

            <motion.div
              className="relative mx-auto mt-7 flex h-44 w-28 items-end justify-center sm:h-52 sm:w-32"
              animate={{ rotate: wobble }}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
            >
              <div className="relative h-40 w-24 sm:h-48 sm:w-28">
                <div className="absolute inset-x-0 bottom-0 top-3 rounded-b-[1.6rem] rounded-t-lg border border-white/55 bg-white/25 shadow-[0_12px_28px_-10px_rgba(61,56,48,0.35)]" />
                <motion.div
                  className="absolute inset-x-[10%] bottom-[6%] rounded-b-[1.25rem]"
                  style={{
                    height: "58%",
                    backgroundColor: "#E8A0B0",
                    opacity: milkOpacity,
                  }}
                />
                <motion.div
                  className="absolute inset-x-[10%] bottom-[6%] rounded-b-[1.25rem]"
                  style={{
                    height: "58%",
                    background: blended,
                    opacity: teaOpacity,
                  }}
                />
                <div className="absolute -top-0.5 left-1/2 h-2.5 w-14 -translate-x-1/2 rounded-full bg-[#fff8f0]" />
                <div className="absolute right-[18%] top-[2%] h-[38%] w-1.5 origin-bottom rotate-[12deg] rounded-full bg-[#f4a582]" />
                <div className="absolute bottom-[14%] left-1/2 flex -translate-x-1/2 gap-1">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="pearl-3d h-1.5 w-1.5 rounded-full" />
                  ))}
                </div>
              </div>
            </motion.div>

            <div
              className={`mt-6 h-1.5 overflow-hidden rounded-full ${
                isNight ? "bg-[#3d3830]" : "bg-[#f5ebe0]"
              }`}
            >
              <motion.div
                className="h-full rounded-full bg-[#f4a582]"
                animate={{ width: `${mix * 100}%` }}
              />
            </div>

            <button
              type="button"
              onClick={onCancel}
              className={`mt-5 font-mono text-[10px] uppercase tracking-widest transition hover:text-[#c4842f] ${
                isNight ? "text-[#a89888]" : "text-[#8b7a68]"
              }`}
            >
              cancel
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

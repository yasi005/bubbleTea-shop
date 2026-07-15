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
  const { playShake } = useVibe();
  const [mix, setMix] = useState(0);
  const lastX = useRef(0);
  const shakeEnergy = useRef(0);

  useEffect(() => {
    if (!open) {
      setMix(0);
      shakeEnergy.current = 0;
      return;
    }
    lastX.current = 0;
  }, [open]);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!open || mix >= 1) {
        return;
      }
      const delta = Math.abs(event.movementX);
      shakeEnergy.current += delta;
      playShake(delta / 30);

      if (shakeEnergy.current > 8) {
        setMix((prev) => Math.min(1, prev + 0.04));
        shakeEnergy.current = 0;
      }
    },
    [open, mix, playShake],
  );

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

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#3d3830]/40 p-6 backdrop-blur-sm"
          onMouseMove={handleMouseMove}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="glass-panel w-full max-w-md rounded-3xl p-8 text-center"
          >
            <h2 className="font-[family-name:var(--font-quicksand)] text-2xl font-bold text-[#3d3830]">
              Shake to mix!
            </h2>
            <p className="mt-2 text-sm text-[#6b5d4f]">
              Wiggle your mouse side-to-side until the layers become one cozy
              pastel swirl.
            </p>

            <div className="relative mx-auto mt-8 h-48 w-32">
              <div className="absolute inset-x-0 bottom-0 top-4 rounded-b-3xl rounded-t-lg border-2 border-white/50 bg-white/20 shadow-warm-lg" />
              <motion.div
                className="absolute inset-x-2 bottom-2 rounded-b-2xl"
                style={{
                  height: "55%",
                  backgroundColor: "#E8A0B0",
                  opacity: milkOpacity,
                }}
              />
              <motion.div
                className="absolute inset-x-2 bottom-2 rounded-b-2xl"
                style={{
                  height: "55%",
                  background: blended,
                  opacity: teaOpacity,
                }}
              />
              <div className="absolute -top-1 left-1/2 h-3 w-16 -translate-x-1/2 rounded-full bg-white/80" />
            </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#f5ebe0]">
              <motion.div
                className="h-full rounded-full bg-[#f4a582]"
                animate={{ width: `${mix * 100}%` }}
              />
            </div>

            <button
              type="button"
              onClick={onCancel}
              className="mt-6 text-xs text-[#8b7a68] transition hover:text-[#c4842f]"
            >
              cancel
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

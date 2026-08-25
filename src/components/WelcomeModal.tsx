"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { useShop } from "@/context/ShopContext";

export function WelcomeModal() {
  const { hydrated, userName, setUserName } = useShop();
  const [name, setName] = useState("");
  const show = hydrated && !userName;

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#4a3f35]/30 p-4 backdrop-blur-sm sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="w-full max-w-md rounded-[1.35rem] bg-[#fdf8f0] p-5 shadow-xl shadow-[#c4842f]/10 sm:rounded-3xl sm:p-8"
          >
            <h2 className="font-[family-name:var(--font-bubble)] text-xl font-bold text-[#4a3f35] sm:text-2xl">
              Welcome, sunshine
            </h2>
            <p className="mt-2 text-sm text-[#6b5d4f] sm:text-base">
              What should we call you? We&apos;ll keep your basket cozy and
              ready.
            </p>
            <form
              className="mt-5 space-y-3 sm:mt-6 sm:space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                setUserName(name);
              }}
            >
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your first name"
                className="w-full rounded-2xl border border-[#ead9c8] bg-white/60 px-4 py-2.5 text-sm text-[#4a3f35] outline-none transition focus:border-[#f4a582] focus:ring-2 focus:ring-[#f4a582]/30 sm:py-3 sm:text-base"
                autoFocus
              />
              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full rounded-full bg-[#f4a582] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e8956f] disabled:cursor-not-allowed disabled:opacity-50 sm:py-3 sm:text-base"
              >
                Start sipping
              </button>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

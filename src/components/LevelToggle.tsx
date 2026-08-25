"use client";

type Level = "0%" | "50%" | "100%";

interface LevelToggleProps {
  label: string;
  value: Level;
  onChange: (value: Level) => void;
}

const LEVELS: Level[] = ["0%", "50%", "100%"];

export function LevelToggle({ label, value, onChange }: LevelToggleProps) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-[#6b5d4f] sm:mb-2 sm:text-sm">
        {label}
      </p>
      <div className="flex gap-1.5 sm:gap-2">
        {LEVELS.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:px-4 sm:py-2.5 sm:text-sm ${
              value === level
                ? "bg-[#f4a582] text-white shadow-sm"
                : "bg-[#f5ebe0] text-[#6b5d4f] active:bg-[#ead9c8] hover:bg-[#ead9c8]"
            }`}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}

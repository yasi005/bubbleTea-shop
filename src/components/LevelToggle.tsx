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
      <p className="mb-2 text-sm font-medium text-[#6b5d4f]">{label}</p>
      <div className="flex gap-2">
        {LEVELS.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              value === level
                ? "bg-[#f4a582] text-white shadow-md"
                : "bg-[#f5ebe0] text-[#6b5d4f] hover:bg-[#ead9c8]"
            }`}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}

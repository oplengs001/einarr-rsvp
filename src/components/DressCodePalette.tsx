import React from "react";
import { DRESS_CODE_COLORS, DressCodeColor } from "@/config/event";

/** Glossy One Piece comic balloon color swatch for the dress code palette. */
function BalloonSwatch({
  color,
  compact = false,
}: {
  color: DressCodeColor;
  compact?: boolean;
}) {
  return (
    <div className="group flex flex-col items-center gap-1.5">
      <svg
        viewBox="0 0 48 64"
        fill="none"
        className={`drop-shadow-[2px_2px_0_rgba(27,27,31,0.18)] transition-transform group-hover:-translate-y-1 ${
          compact ? "h-10 w-8 sm:h-11 sm:w-8" : "h-12 w-9 sm:h-14 sm:w-10"
        }`}
        aria-hidden="true"
      >
        {/* Ribbon string */}
        <path
          d="M24 46 C 21 51, 27 55, 23 61"
          stroke="#1b1b1f"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.55"
        />
        {/* Balloon tie knot */}
        <path
          d="M20.5 46 L27.5 46 L25 42.5 L23 42.5 Z"
          fill={color.hex}
          stroke="#1b1b1f"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Balloon body */}
        <path
          d="M24 4 C 11.5 4, 5 14, 5 25 C 5 35.5, 14 43, 24 43 C 34 43, 43 35.5, 43 25 C 43 14, 36.5 4, 24 4 Z"
          fill={color.hex}
          stroke="#1b1b1f"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        {/* Comic gloss highlight */}
        <path
          d="M14.5 13 C 12 16, 11 20, 11.5 24"
          stroke={color.shineHex}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <circle cx="16.8" cy="10" r="1.6" fill={color.shineHex} />
      </svg>
      <span className="text-center text-xs font-extrabold leading-tight text-ink">
        {color.name}
      </span>
    </div>
  );
}

/** Shared dress code color swatch grid sourced from DRESS_CODE_COLORS. */
export default function DressCodePalette({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-3 sm:grid-cols-6 ${
        compact ? "gap-2.5" : "gap-3"
      }`}
    >
      {DRESS_CODE_COLORS.map((color) => (
        <BalloonSwatch key={color.name} color={color} compact={compact} />
      ))}
    </div>
  );
}


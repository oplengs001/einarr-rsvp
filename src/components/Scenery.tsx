const PUFFS: [number, number, number][] = [
  [38, 66, 22],
  [70, 48, 30],
  [108, 40, 34],
  [146, 54, 26],
  [170, 70, 16],
];

/** Puffy, ink-outlined cloud in the style of Oda's skies. */
export function Cloud({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 100" className={className} aria-hidden="true">
      <g fill="#1b1b1f">
        {PUFFS.map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r + 3.5} />
        ))}
        <rect x="12.5" y="62" width="171" height="27" rx="13.5" />
      </g>
      <g fill="#ffffff">
        {PUFFS.map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} />
        ))}
        <rect x="16" y="65" width="164" height="20.5" rx="10" />
      </g>
      <path
        d="M30 80 H170"
        stroke="#d5ecf9"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

const BACK_WAVE =
  "M0 70 C 120 30 240 30 360 70 S 600 110 720 70 S 960 30 1080 70 S 1320 110 1440 70";
const FRONT_WAVE =
  "M0 98 C 140 62 260 62 400 98 S 660 134 800 98 S 1060 62 1200 98 S 1380 124 1440 102";

/** Two layered waves that blend into the sea-colored section below. */
export function Waves({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 140"
      preserveAspectRatio="none"
      className={`block h-20 w-full sm:h-28 ${className}`}
      aria-hidden="true"
    >
      <path d={`${BACK_WAVE} V140 H0 Z`} fill="#2f86cf" />
      <path
        d={BACK_WAVE}
        fill="none"
        stroke="#1b1b1f"
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
      />
      <path d={`${FRONT_WAVE} V140 H0 Z`} fill="#0d4a8a" />
      <path
        d={FRONT_WAVE}
        fill="none"
        stroke="#1b1b1f"
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}


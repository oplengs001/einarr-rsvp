import React from "react";
import Image from "next/image";

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
    <svg
      viewBox="0 0 200 100"
      className={className}
      aria-hidden="true"
      data-gsap="cloud"
    >
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

/** Stylized Oda-style ink seagull with crisp white under-wing highlight. */
export function Seagull({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 26"
      className={`inline-block ${className}`}
      fill="none"
      aria-hidden="true"
      data-gsap="gull"
    >
      <path
        d="M3 16 C 11 4, 21 3, 28 12 C 35 3, 45 4, 53 16 C 43 10, 34 11, 28 18 C 22 11, 13 10, 3 16 Z"
        fill="#ffffff"
        stroke="#1b1b1f"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M11 10 C 16 6, 22 7, 28 14 C 34 7, 40 6, 45 10"
        stroke="#1b1b1f"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Flock of Oda-style seagulls floating across the hero sky. */
export function Seagulls({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <Seagull className="absolute left-[18%] top-[22%] h-4 w-8 opacity-90 sm:left-[18%] sm:top-[16%] sm:h-5 sm:w-10" />
      <Seagull className="hidden sm:block sm:absolute sm:left-[26%] sm:top-[9%] sm:h-4 sm:w-8 opacity-75" />
      <Seagull className="absolute right-[16%] top-[6%] h-3.5 w-7 opacity-85 sm:right-[19%] sm:top-[15%] sm:h-4 sm:w-9" />
      <Seagull className="absolute right-[12%] top-[23%] hidden h-3.5 w-7 opacity-65 sm:block" />
    </div>
  );
}

/** Delicate sky breeze swirl wisps matching Grand Line weather illustrations. */
export function WindWisps({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 90 36"
        fill="none"
        data-gsap="wisp"
        className="absolute left-[18%] top-[54%] hidden w-20 opacity-45 sm:block"
      >
        <path
          d="M4 22 C 24 22, 34 10, 56 12 C 70 13, 78 20, 72 26 C 67 31, 58 27, 61 21"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M22 29 H 46"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>

      <svg
        viewBox="0 0 96 34"
        fill="none"
        data-gsap="wisp"
        className="absolute right-[14%] top-[38%] hidden w-24 opacity-45 sm:block"
      >
        <path
          d="M6 18 C 28 18, 42 8, 66 10 C 80 11, 86 18, 80 23 C 75 27, 67 24, 70 19"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M28 26 H 58"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>

      <svg
        viewBox="0 0 80 30"
        fill="none"
        data-gsap="wisp"
        className="absolute left-[7%] top-[44%] w-16 opacity-35"
      >
        <path
          d="M6 12 C 20 22, 44 22, 64 11"
          stroke="#ffffff"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <circle cx="38" cy="23" r="2" fill="#ffffff" opacity="0.8" />
      </svg>
    </div>
  );
}

/**
 * Weathered wooden hanging sign anchored by twin ropes to the top of the sky,
 * displaying the transparent official Straw Hat Jolly Roger PNG.
 */
export function JollyRoger({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`relative mx-auto w-fit select-none ${className}`}
      data-gsap="jolly"
    >
      {/* Twin ropes descending from the top edge of the hero */}
      <div className="mx-auto flex w-24 justify-between px-2 sm:w-28">
        <div className="h-9 w-[5px] border-x-2 border-ink bg-[#c89a5b] shadow-sm sm:h-11" />
        <div className="h-9 w-[5px] border-x-2 border-ink bg-[#c89a5b] shadow-sm sm:h-11" />
      </div>

      {/* Weathered wooden signboard */}
      <div className="relative -mt-1 flex h-[106px] w-36 items-center justify-center sm:h-[120px] sm:w-44">
        <svg
          viewBox="0 0 180 124"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full drop-shadow-[0_6px_0_rgba(27,27,31,0.22)]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="sign-wood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bd8249" />
              <stop offset="50%" stopColor="#a36834" />
              <stop offset="100%" stopColor="#854f23" />
            </linearGradient>
          </defs>
          {/* Slightly notched wooden plank silhouette */}
          <path
            d="M8 6 L68 8 L73 14 L78 8 L172 6 L168 38 L173 43 L169 48 L172 86 L167 90 L171 118 L112 116 L107 110 L102 117 L9 118 L12 82 L7 77 L12 71 L8 36 L13 31 Z"
            fill="url(#sign-wood)"
            stroke="#1b1b1f"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Plank seam & wood grain lines */}
          <line
            x1="12"
            y1="62"
            x2="168"
            y2="62"
            stroke="#5e3514"
            strokeWidth="2"
            opacity="0.55"
          />
          <path
            d="M24 26 Q 55 21, 90 26 M 108 42 Q 138 38, 158 43 M 22 92 Q 62 96, 98 90 M 116 82 Q 144 86, 158 81"
            stroke="#6e3f19"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          />
          {/* Corner nails attaching the ropes */}
          <circle cx="34" cy="17" r="4" fill="#3a2310" stroke="#1b1b1f" strokeWidth="1.5" />
          <circle cx="146" cy="17" r="4" fill="#3a2310" stroke="#1b1b1f" strokeWidth="1.5" />
        </svg>

        <Image
          src="/op-icons/jolly-roger.png"
          alt="Straw Hat Jolly Roger"
          width={140}
          height={140}
          priority
          unoptimized
          className="relative z-10 h-20 w-20 object-contain drop-shadow-[0_2px_0_rgba(27,27,31,0.3)] sm:h-24 sm:w-24"
        />
      </div>
    </div>
  );
}

const TORN_MAP_PATH =
  "M 14 10 L 48 9 L 55 16 L 62 9 L 120 10 L 126 15 L 132 10 L 210 9 L 217 16 L 224 9 L 340 10 L 347 17 L 354 10 L 430 11 L 437 16 L 443 10 L 515 9 L 522 17 L 530 9 L 590 8 L 596 14 L 604 9 L 626 10 L 624 28 L 618 36 L 625 45 L 620 64 L 626 73 L 618 84 L 624 96 L 622 110 L 580 112 L 574 105 L 567 112 L 505 111 L 499 106 L 492 112 L 415 113 L 409 105 L 402 113 L 320 112 L 314 106 L 307 113 L 230 113 L 223 105 L 216 113 L 84 112 L 78 105 L 71 113 L 14 113 L 18 94 L 11 83 L 17 71 L 10 58 L 18 45 L 12 30 Z";

/**
 * Hand-drawn torn treasure map / bounty parchment card for event details.
 */
export function TornMapCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative mx-auto w-full max-w-xl drop-shadow-[0_5px_0_rgba(27,27,31,0.22)] ${className}`}
    >
      <svg
        viewBox="0 0 640 122"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="torn-map-clip">
            <path d={TORN_MAP_PATH} />
          </clipPath>
          <radialGradient id="torn-map-fill" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#f6e9c9" />
            <stop offset="65%" stopColor="#ebd4a4" />
            <stop offset="100%" stopColor="#d9b679" />
          </radialGradient>
        </defs>

        <g clipPath="url(#torn-map-clip)">
          <rect x="0" y="0" width="640" height="122" fill="url(#torn-map-fill)" />

          {/* Subtle aged parchment smudges */}
          <ellipse cx="90" cy="32" rx="70" ry="24" fill="#c99c58" opacity="0.12" />
          <ellipse cx="535" cy="90" rx="85" ry="26" fill="#b98945" opacity="0.14" />

          {/* Warm aged inner bevel shading hugging the torn perimeter & V-notches */}
          <path
            d={TORN_MAP_PATH}
            fill="none"
            stroke="#bf904c"
            strokeWidth="14"
            strokeOpacity="0.45"
            strokeLinejoin="round"
          />
          <path
            d={TORN_MAP_PATH}
            fill="none"
            stroke="#946528"
            strokeWidth="5"
            strokeOpacity="0.25"
            strokeLinejoin="round"
          />
        </g>

        {/* Crisp outer ink outline */}
        <path
          d={TORN_MAP_PATH}
          fill="none"
          stroke="#1b1b1f"
          strokeWidth="2.5"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * Full-color, high-detail Thousand Sunny ship with transparent background.
 */
export function ThousandSunnyShip({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      data-gsap="sunny"
      aria-hidden="true"
    >
      <Image
        src="/op-icons/thousand-sunny.png"
        alt="Thousand Sunny"
        width={360}
        height={540}
        priority
        unoptimized
        className="h-auto w-full object-contain drop-shadow-[0_10px_20px_rgba(8,47,90,0.38)]"
      />
    </div>
  );
}

/**
 * Chunky wooden & iron Ship's Helm wheel for the hero RSVP button.
 */
export function ShipHelmBadge({
  className = "w-12 h-12",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* 8 wooden handles / spokes */}
      <g stroke="#1b1b1f" strokeWidth="2.8" strokeLinecap="round">
        <line x1="32" y1="6" x2="32" y2="58" stroke="#9b612e" strokeWidth="5.5" />
        <line x1="6" y1="32" x2="58" y2="32" stroke="#9b612e" strokeWidth="5.5" />
        <line x1="13.6" y1="13.6" x2="50.4" y2="50.4" stroke="#9b612e" strokeWidth="5.5" />
        <line x1="50.4" y1="13.6" x2="13.6" y2="50.4" stroke="#9b612e" strokeWidth="5.5" />
      </g>
      <g stroke="#1b1b1f" strokeWidth="2.4" strokeLinecap="round">
        <line x1="32" y1="6" x2="32" y2="58" />
        <line x1="6" y1="32" x2="58" y2="32" />
        <line x1="13.6" y1="13.6" x2="50.4" y2="50.4" />
        <line x1="50.4" y1="13.6" x2="13.6" y2="50.4" />
      </g>
      {/* Handle end caps */}
      {[
        [32, 6],
        [32, 58],
        [6, 32],
        [58, 32],
        [13.6, 13.6],
        [50.4, 50.4],
        [50.4, 13.6],
        [13.6, 50.4],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="3.2"
          fill="#b87a42"
          stroke="#1b1b1f"
          strokeWidth="2.2"
        />
      ))}

      {/* Outer iron wheel rim */}
      <circle cx="32" cy="32" r="18.5" stroke="#1b1b1f" strokeWidth="8.5" />
      <circle cx="32" cy="32" r="18.5" stroke="#7d8694" strokeWidth="4.2" />

      {/* Center brass hub */}
      <circle
        cx="32"
        cy="32"
        r="6.2"
        fill="#ffcc1f"
        stroke="#1b1b1f"
        strokeWidth="2.6"
      />
      <circle cx="32" cy="32" r="2.1" fill="#1b1b1f" />
    </svg>
  );
}

const BACK_WAVE =
  "M0 70 C 120 30 240 30 360 70 S 600 110 720 70 S 960 30 1080 70 S 1320 110 1440 70";
const FRONT_WAVE =
  "M0 98 C 140 62 260 62 400 98 S 660 134 800 98 S 1060 62 1200 98 S 1380 124 1440 102";

/**
 * Two layered waves that blend into the sea-colored section below.
 * When `showShip` is enabled, nests the transparent Thousand Sunny ship
 * between the back wave and front wave with cartoon seafoam splashes.
 */
export function Waves({
  className = "",
  showShip = false,
}: {
  className?: string;
  showShip?: boolean;
}) {
  return (
    <div className={`pointer-events-none ${className}`}>
      {/* Back Wave Layer */}
      <svg
        viewBox="0 0 1440 150"
        preserveAspectRatio="none"
        data-gsap="wave-back"
        className="relative z-0 -ml-[3%] block h-20 w-[106%] translate-y-1.5 sm:h-28"
        aria-hidden="true"
      >
        <path d={`${BACK_WAVE} V150 H0 Z`} fill="#2f86cf" />
        <path
          d={BACK_WAVE}
          fill="none"
          stroke="#1b1b1f"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Thousand Sunny Ship tucked behind the front wave crest (left on mobile to clear Binks' Sake pill, right on sm+) */}
      {showShip && (
        <div className="absolute bottom-3 left-[4%] z-10 w-28 sm:bottom-5 sm:left-auto sm:right-[6%] sm:w-40 md:w-48 lg:right-[8%] lg:w-52 xl:right-[10%]">
          <ThousandSunnyShip />
          {/* Cartoon waterline splashes right around the hull */}
          <svg
            viewBox="0 0 220 56"
            fill="none"
            className="pointer-events-none absolute -bottom-1 -left-4 z-30 w-[120%]"
            aria-hidden="true"
          >
            <path
              d="M14 40 Q24 22 36 32 Q42 18 52 34 M165 36 Q178 20 188 30 Q196 18 206 34"
              stroke="#e6f6ff"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle cx="10" cy="24" r="3" fill="#ffffff" stroke="#1b1b1f" strokeWidth="1.5" />
            <circle cx="26" cy="16" r="2.2" fill="#e6f6ff" stroke="#1b1b1f" strokeWidth="1.3" />
            <circle cx="198" cy="18" r="2.6" fill="#ffffff" stroke="#1b1b1f" strokeWidth="1.4" />
            <circle cx="212" cy="28" r="2.2" fill="#e6f6ff" stroke="#1b1b1f" strokeWidth="1.3" />
          </svg>
        </div>
      )}

      {/* Front Wave Layer */}
      <svg
        viewBox="0 0 1440 150"
        preserveAspectRatio="none"
        data-gsap="wave-front"
        className="absolute inset-x-0 -bottom-2 z-20 -ml-[3%] block h-20 w-[106%] sm:h-28"
        aria-hidden="true"
      >
        <path d={`${FRONT_WAVE} V150 H0 Z`} fill="#0d4a8a" />
        <path
          d={FRONT_WAVE}
          fill="none"
          stroke="#1b1b1f"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

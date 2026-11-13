"use client";

import React, { useEffect, useRef, useState } from "react";
import { PIRATE_AVATARS } from "@/config/event";
import { AttendanceStatus } from "@/lib/store";

interface WantedPosterProps {
  name: string;
  epithet: string;
  bounty: number;
  avatarId: string;
  plusOnes: number;
  attending: AttendanceStatus;
  posterRef?: React.RefObject<HTMLDivElement | null>;
}

/** The Berry currency mark: a B with two vertical strokes. */
export function BerrySymbol({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Berries"
    >
      <path
        d="M12 2.5V41.5M18 2.5V41.5"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M7 8H21C25.97 8 29.5 10.7 29.5 15C29.5 18.2 27.2 20.7 23.5 21.5C28 22.3 30.5 25.1 30.5 29.2C30.5 34 26.5 36.8 20.5 36.8H7"
        stroke="currentColor"
        strokeWidth="3.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 8V36.8" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round" />
      <path d="M9 21.5H22.5" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}

/** Authentic One Piece two-part S-curve calligraphic scroll flourishes along the poster sides. */
function SideScrolls({ mirror = false }: { mirror?: boolean }) {
  return (
    <svg
      viewBox="0 0 32 216"
      fill="none"
      className={`pointer-events-none h-full w-6 shrink-0 select-none sm:w-7 ${
        mirror ? "-scale-x-100" : ""
      }`}
      aria-hidden="true"
    >
      {/* Top S-scroll flanking DEAD OR ALIVE */}
      <path
        d="M21 17 C24 11, 15 6, 11 14 C7 22, 13 38, 17 54 C21 70, 19 88, 12 94 C7 97, 5 90, 9 86"
        stroke="#2c1d11"
        strokeWidth="3.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="21" cy="17" r="3.4" fill="#2c1d11" />
      <circle cx="9.5" cy="87" r="3" fill="#2c1d11" />

      {/* Bottom S-scroll flanking Name, Bounty & bottom legal/MARINE bar */}
      <path
        d="M20 113 C24 107, 15 103, 11 112 C6 124, 10 144, 14 164 C17 182, 14 198, 13 204 C13 210, 22 211, 24 203 C25 198, 20 195, 18 198"
        stroke="#2c1d11"
        strokeWidth="3.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="113" r="3.2" fill="#2c1d11" />
      <circle cx="20" cy="201" r="4" fill="#2c1d11" />
    </svg>
  );
}

/** Animates a number toward its target value. */
function useCountUp(target: number, duration = 350) {
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);

  useEffect(() => {
    const start = valueRef.current;
    if (start === target) return;
    const startTime = performance.now();
    let raf = 0;

    const step = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = Math.round(start + (target - start) * eased);
      valueRef.current = next;
      setValue(next);
      if (t < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

export default function WantedPoster({
  name,
  epithet,
  bounty,
  avatarId,
  plusOnes,
  attending,
  posterRef,
}: WantedPosterProps) {
  const isSelfie = avatarId.startsWith("data:image/");
  const avatar = PIRATE_AVATARS.find((a) => a.id === avatarId) ?? PIRATE_AVATARS[0];
  const displayedBounty = useCountUp(bounty);

  const trimmedName = name.trim();
  const displayName = trimmedName ? trimmedName.toUpperCase() : "YOUR NAME";
  const showNakama = attending === "yes" && plusOnes > 0;

  return (
    <div className="mx-auto w-full max-w-[404px]">
      {/* Separate margin-free export container with 12px allowance so ink border & 8px shadow are never clipped */}
      <div ref={posterRef} className="w-full p-3">
        <div
          className="border-[3px] border-ink px-5 pb-4 pt-4 font-wanted text-[#2c1d11]"
          style={{
            background:
              "radial-gradient(115% 88% at 50% 42%, #efe0b9 0%, #dfc48e 58%, #be9960 100%)",
            boxShadow:
              "inset 0 0 46px rgba(68, 42, 16, 0.42), 8px 8px 0 #1b1b1f",
          }}
        >
          <h3 className="overflow-hidden py-1 text-center">
            <span
              className="inline-block origin-center scale-y-[1.16] text-[58px] font-black leading-[0.88] tracking-[0.04em] sm:text-[70px]"
              style={{ WebkitTextStroke: "0.8px #2c1d11" }}
            >
              WANTED
            </span>
          </h3>

          <div className="mt-2 border-[3px] border-[#2c1d11] bg-[#111]">
            <div className="relative aspect-[6/5] overflow-hidden">
              {isSelfie ? (
                <img
                  src={avatarId}
                  alt={displayName}
                  className="h-full w-full object-cover sepia-[0.16] contrast-[1.04]"
                />
              ) : (
                <img
                  src={avatar.iconSrc}
                  alt={avatar.label}
                  className="h-full w-full object-contain"
                />
              )}
            </div>
          </div>

          <div className="relative mt-2.5 flex items-stretch justify-between gap-1">
            <SideScrolls />

            <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
              <div>
                <p className="text-center text-[19px] font-black tracking-[0.18em] sm:text-[22px]">
                  {attending === "no" ? "IN SPIRIT" : "DEAD OR ALIVE"}
                </p>

                <p className="mt-1.5 text-center text-xs italic text-[#2c1d11]/80 sm:text-sm">
                  &ldquo;{epithet}&rdquo;
                </p>
                <p
                  className={`text-center font-black leading-tight tracking-wide [overflow-wrap:anywhere] ${
                    trimmedName.length > 14
                      ? "text-[19px] sm:text-[21px]"
                      : "text-[25px] sm:text-[29px]"
                  } ${trimmedName ? "" : "text-[#2c1d11]/35"}`}
                >
                  {displayName}
                </p>
                {showNakama && (
                  <p className="text-center text-xs font-bold text-[#2c1d11]/80 sm:text-sm">
                    and {plusOnes} nakama
                  </p>
                )}

                <div className="mt-2.5 flex items-center justify-center gap-1.5 px-1">
                  <BerrySymbol className="h-5 w-4 shrink-0 sm:h-6 sm:w-5" />
                  <span className="text-[21px] font-black leading-none tabular-nums sm:text-[26px]">
                    {displayedBounty.toLocaleString("en-US")}-
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-end justify-between gap-2 pt-1">
                <p className="max-w-[165px] text-[5.5px] font-bold uppercase leading-[1.2] text-[#2c1d11]/75 sm:max-w-[180px] sm:text-[6px]">
                  Kono sakuhin wa fiction desu node jitsuzai suru jinbutsu
                  dantai sonota no soshiki to wa issai kankei arimasen. December
                  6 &middot; GDLS Kubo Residences.
                </p>
                <span className="shrink-0 text-sm font-black tracking-[0.16em] sm:text-base">
                  MARINE
                </span>
              </div>
            </div>

            <SideScrolls mirror />
          </div>
        </div>
      </div>
    </div>
  );
}

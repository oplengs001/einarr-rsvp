"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
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
    <div ref={posterRef} className="mx-auto w-full max-w-[380px]">
      <div
        className="border-[3px] border-ink px-6 pb-5 pt-4 font-wanted text-ink"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, #f4e6c3 0%, #ebd5a5 60%, #dcbf85 100%)",
          boxShadow: "inset 0 0 42px rgba(120, 80, 30, 0.32), 8px 8px 0 #1b1b1f",
        }}
      >
        <h3 className="text-center text-[64px] font-black leading-none tracking-tight">
          WANTED
        </h3>

        <div className="mt-3 border-[3px] border-ink bg-[#111]">
          <div className="relative aspect-[6/5] overflow-hidden">
            {isSelfie ? (
              <img
                src={avatarId}
                alt={displayName}
                className="h-full w-full object-cover sepia-[0.16] contrast-[1.04]"
              />
            ) : (
              <Image
                src={avatar.iconSrc}
                alt={avatar.label}
                fill
                sizes="380px"
                unoptimized
                className="object-contain"
              />
            )}
          </div>
        </div>

        <p className="mt-3 text-center text-[22px] font-bold tracking-[0.18em]">
          {attending === "no" ? "IN SPIRIT" : "DEAD OR ALIVE"}
        </p>

        <p className="mt-2 text-center text-sm italic text-ink/70">
          &ldquo;{epithet}&rdquo;
        </p>
        <p
          className={`text-center font-black leading-tight tracking-wide [overflow-wrap:anywhere] ${
            trimmedName.length > 14 ? "text-[22px]" : "text-[30px]"
          } ${trimmedName ? "" : "text-ink/30"}`}
        >
          {displayName}
        </p>
        {showNakama && (
          <p className="text-center text-sm font-bold text-ink/70">
            and {plusOnes} nakama
          </p>
        )}

        <div className="mt-3 flex items-center gap-2">
          <BerrySymbol className="h-7 w-6 shrink-0" />
          <span className="text-[30px] font-black leading-none tabular-nums">
            {displayedBounty.toLocaleString("en-US")}
          </span>
          <span className="ml-auto text-[30px] font-black leading-none">-</span>
        </div>

        <div className="mt-3 flex items-end justify-between gap-3 border-t border-ink/30 pt-2">
          <p className="max-w-[220px] text-[6.5px] uppercase leading-[1.25] text-ink/55">
            Kono sakuhin wa fiction desu node jitsuzai suru jinbutsu dantai
            sonota no soshiki to wa issai kankei arimasen. December 6 · GDLS
            Kubo Residences.
          </p>
          <span className="text-sm font-black tracking-[0.2em]">MARINE</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function CaptainBabyEinarr({
  className = "",
}: {
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const handleCheer = () => {
    if (!wrapRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      wrapRef.current,
      { y: 0, scale: 1 },
      {
        y: -10,
        scale: 1.04,
        duration: 0.22,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      }
    );
  };

  return (
    <div
      className={`relative inline-block select-none ${className}`}
      onClick={handleCheer}
      title="Captain Einarr!"
    >
      {/* Subtle twinkling One Piece sparkles around Baby Einarr */}
      <svg
        viewBox="0 0 24 24"
        data-gsap="baby-sparkle"
        className="pointer-events-none absolute -left-2 top-8 z-20 h-5 w-5 text-sun drop-shadow-[1px_1px_0_#1b1b1f]"
        aria-hidden="true"
      >
        <path
          d="M12 1 L14.8 9.2 L23 12 L14.8 14.8 L12 23 L9.2 14.8 L1 12 L9.2 9.2 Z"
          fill="currentColor"
          stroke="#1b1b1f"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        viewBox="0 0 24 24"
        data-gsap="baby-sparkle"
        className="pointer-events-none absolute right-0 top-5 z-20 h-4 w-4 text-white drop-shadow-[1px_1px_0_#1b1b1f]"
        aria-hidden="true"
      >
        <path
          d="M12 1 L14.8 9.2 L23 12 L14.8 14.8 L12 23 L9.2 14.8 L1 12 L9.2 9.2 Z"
          fill="currentColor"
          stroke="#1b1b1f"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        viewBox="0 0 24 24"
        data-gsap="baby-sparkle"
        className="pointer-events-none absolute -left-3 bottom-24 z-20 h-3.5 w-3.5 text-sun drop-shadow-[1px_1px_0_#1b1b1f]"
        aria-hidden="true"
      >
        <path
          d="M12 1 L14.8 9.2 L23 12 L14.8 14.8 L12 23 L9.2 14.8 L1 12 L9.2 9.2 Z"
          fill="currentColor"
          stroke="#1b1b1f"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>

      {/* Subtle ambient motion + playful tap bounce */}
      <div ref={wrapRef} className="cursor-pointer">
        <div data-gsap="baby">
          <Image
            src="/op-icons/baby-einarr.png"
            alt="Baby Einarr wearing Luffy's Straw Hat and red vest"
            width={869}
            height={938}
            priority
            unoptimized
            className="h-auto w-full object-contain drop-shadow-[0_6px_12px_rgba(27,27,31,0.22)]"
          />
        </div>
      </div>
    </div>
  );
}


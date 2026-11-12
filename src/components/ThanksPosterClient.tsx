"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import confetti from "canvas-confetti";
import { toPng } from "html-to-image";
import WantedPoster from "@/components/WantedPoster";
import { EVENT_CONFIG } from "@/config/event";
import { RsvpRecord } from "@/lib/store";

export default function ThanksPosterClient({ rsvp }: { rsvp: RsvpRecord }) {
  const posterRef = useRef<HTMLDivElement | null>(null);
  const [downloading, setDownloading] = useState(false);

  const attending = rsvp.attending === "yes";
  const firstName = rsvp.name.trim().split(/\s+/)[0];
  const seats = 1 + rsvp.plus_ones;

  useEffect(() => {
    if (!attending) return;
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#e2312d", "#ffcc1f", "#5cc2f0", "#ffffff"],
      });
    } catch {
      // Decorative only.
    }
  }, [attending]);

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(posterRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const slug =
        rsvp.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || "pirate";
      const link = document.createElement("a");
      link.download = `wanted-${slug}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export poster:", err);
    } finally {
      setDownloading(false);
    }
  };

  const details: [string, string][] = [
    ["Response", attending ? "Attending" : "Not attending"],
    ...(attending
      ? ([
          [
            "Seats",
            rsvp.plus_ones === 0
              ? "1 (just you)"
              : `${seats} (you + ${rsvp.plus_ones})`,
          ],
        ] as [string, string][])
      : []),
    ["When", EVENT_CONFIG.dateLong],
    ["Where", EVENT_CONFIG.venueDisplay],
  ];

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center">
      <div>
        <WantedPoster
          posterRef={posterRef}
          name={rsvp.name}
          epithet={rsvp.epithet}
          bounty={rsvp.bounty}
          avatarId={rsvp.avatar}
          plusOnes={rsvp.plus_ones}
          attending={rsvp.attending}
        />
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="btn-plank"
          >
            {downloading ? "Saving…" : "Download poster"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border-[3px] border-ink bg-paper p-6 shadow-ink-lg sm:p-8">
        <div className="flex items-center gap-3">
          <Image
            src="/op-icons/Phone.png"
            alt="Den Den Mushi"
            width={44}
            height={44}
            unoptimized
            className="h-11 w-11 rounded-lg border-[3px] border-ink"
          />
          <p className="font-bold italic text-ink/60">Puru puru puru… gacha!</p>
        </div>

        <h1 className="mt-5 font-display text-4xl leading-tight tracking-wide sm:text-5xl">
          {attending ? "You're on the crew!" : "Thanks for letting us know"}
        </h1>
        <p className="mt-3 text-lg text-ink/75">
          {attending
            ? `We can't wait to celebrate with you, ${firstName}.`
            : `We'll miss you, ${firstName}. Thank you for sending your love to ${EVENT_CONFIG.honoreeDisplay}.`}
        </p>

        <dl className="mt-7 divide-y-2 divide-ink/10 overflow-hidden rounded-xl border-[3px] border-ink bg-white">
          {details.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 px-5 py-3">
              <dt className="font-semibold text-ink/60">{label}</dt>
              <dd className="text-right font-extrabold">
                {label === "Where" ? (
                  <a
                    href={EVENT_CONFIG.venueMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-ink/35 decoration-2 underline-offset-4 transition hover:text-luffy hover:decoration-luffy"
                  >
                    {value} ↗
                  </a>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </dl>

        {rsvp.message && (
          <blockquote className="mt-6 border-l-4 border-luffy pl-4 italic text-ink/80">
            &ldquo;{rsvp.message}&rdquo;
          </blockquote>
        )}

        <Link
          href="/"
          className="mt-7 inline-block text-sm font-extrabold underline underline-offset-4 hover:text-luffy"
        >
          RSVP for someone else
        </Link>
      </div>
    </div>
  );
}

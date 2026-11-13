"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import WantedPoster from "@/components/WantedPoster";
import SelfiePicker from "@/components/SelfiePicker";
import DressCodePalette from "@/components/DressCodePalette";
import {
  EVENT_CONFIG,
  PIRATE_AVATARS,
  getEpithetForName,
  calculateBounty,
} from "@/config/event";
import { AttendanceStatus } from "@/lib/store";
import { submitRsvpAction } from "@/app/actions";

const WILL_OF_D = /(^|\s)D\.(\s|$)/i;

function toggleWillOfD(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "Monkey D. Rookie";
  if (WILL_OF_D.test(trimmed)) {
    return trimmed.replace(/\s*\bD\.\s*/i, " ").trim();
  }
  const [first, ...rest] = trimmed.split(/\s+/);
  return rest.length ? `${first} D. ${rest.join(" ")}` : `${first} D.`;
}

function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  const labelClass = "font-display text-xl tracking-wide text-ink";
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        {htmlFor ? (
          <label htmlFor={htmlFor} className={labelClass}>
            {label}
          </label>
        ) : (
          <h3 className={labelClass}>{label}</h3>
        )}
        {hint && <span className="text-sm text-ink/60">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const chip =
  "rounded-md border-2 border-ink bg-white px-2.5 py-1 text-xs font-extrabold transition hover:bg-sun";

export default function RsvpInteractive() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [shuffle, setShuffle] = useState(0);
  const [customEpithet, setCustomEpithet] = useState<string | null>(null);
  const [editingEpithet, setEditingEpithet] = useState(false);
  const [avatarId, setAvatarId] = useState("luffy");
  const [selfie, setSelfie] = useState<string | null>(null);
  const [attending, setAttending] = useState<AttendanceStatus>("yes");
  const [plusOnes, setPlusOnes] = useState(0);
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);

  const epithet = customEpithet ?? getEpithetForName(name, shuffle);
  const effectivePlusOnes = attending === "yes" ? plusOnes : 0;
  const bounty = calculateBounty(name, effectivePlusOnes, attending, shuffle);
  const avatar = PIRATE_AVATARS.find((a) => a.id === avatarId) ?? PIRATE_AVATARS[0];
  const hasWillOfD = WILL_OF_D.test(name.trim());
  const seats = 1 + effectivePlusOnes;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Even Luffy wrote his name. Add yours first.");
      document.getElementById("pirate-name")?.focus();
      return;
    }

    startTransition(async () => {
      const result = await submitRsvpAction({
        name: name.trim(),
        epithet: epithet.trim() || getEpithetForName(name, shuffle),
        bounty,
        avatar: selfie ?? avatarId,
        attending,
        plus_ones: effectivePlusOnes,
        message: message.trim(),
        honeypot,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.65 },
          colors: ["#e2312d", "#ffcc1f", "#5cc2f0", "#ffffff"],
        });
      } catch {
        // Confetti is decorative; ignore failures.
      }

      router.push(`/thanks/${result.id}`);
    });
  };

  // Prevent pressing Enter inside text inputs from submitting the RSVP early
  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
      e.preventDefault();
      if (editingEpithet) {
        setEditingEpithet(false);
      } else {
        (e.target as HTMLInputElement).blur();
      }
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
      <div id="poster-preview" className="order-2 lg:order-1 lg:sticky lg:top-8">
        <WantedPoster
          name={name}
          epithet={epithet}
          bounty={bounty}
          avatarId={selfie ?? avatarId}
          plusOnes={effectivePlusOnes}
          attending={attending}
        />
        <p className="mt-5 text-center text-sm font-semibold text-white/65">
          Your poster updates as you fill in the form.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        onKeyDown={handleFormKeyDown}
        className="order-1 space-y-9 rounded-2xl border-[3px] border-ink bg-paper p-5 shadow-ink-lg sm:p-8 lg:order-2"
      >
        {/* Spam trap, hidden from people */}
        <div className="hidden" aria-hidden="true">
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <Field label="Your name" htmlFor="pirate-name">
          <input
            id="pirate-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            placeholder="e.g. Marco Cruz"
            maxLength={55}
            autoComplete="name"
            enterKeyHint="done"
            className="w-full rounded-lg border-[3px] border-ink bg-white px-4 py-3 text-lg font-bold text-ink outline-none transition placeholder:font-semibold placeholder:text-ink/35 focus:ring-4 focus:ring-sun/70"
          />

          <label className="mt-3 inline-flex cursor-pointer select-none items-center gap-2 text-sm font-bold text-ink/80">
            <input
              type="checkbox"
              checked={hasWillOfD}
              onChange={() => setName((n) => toggleWillOfD(n))}
              className="h-4 w-4 accent-luffy"
            />
            Carry the Will of D.
          </label>

          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border-2 border-dashed border-ink/25 px-3 py-2.5">
            <span className="text-sm font-semibold text-ink/60">Epithet</span>
            {editingEpithet ? (
              <input
                type="text"
                value={customEpithet ?? ""}
                onChange={(e) => setCustomEpithet(e.target.value)}
                maxLength={50}
                enterKeyHint="done"
                autoFocus
                className="min-w-0 flex-1 rounded-md border-2 border-ink bg-white px-2 py-1 text-sm font-bold"
              />
            ) : (
              <span className="flex-1 text-sm font-extrabold italic">
                &ldquo;{epithet}&rdquo;
              </span>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                className={chip}
                onClick={() => {
                  setCustomEpithet(null);
                  setEditingEpithet(false);
                  setShuffle((s) => s + 1);
                }}
              >
                Shuffle
              </button>
              <button
                type="button"
                className={chip}
                onClick={() => {
                  if (!editingEpithet && customEpithet === null) {
                    setCustomEpithet(epithet);
                  }
                  setEditingEpithet((v) => !v);
                }}
              >
                {editingEpithet ? "Done" : "Edit"}
              </button>
            </div>
          </div>
        </Field>

        <Field label="Choose your flag or take a selfie">
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6" role="radiogroup">
            {PIRATE_AVATARS.map((av) => {
              const selected = !selfie && av.id === avatarId;
              return (
                <button
                  key={av.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => {
                    setAvatarId(av.id);
                    setSelfie(null);
                  }}
                  className="group flex flex-col items-center gap-1.5"
                >
                  <span
                    className={`relative block aspect-square w-full overflow-hidden rounded-lg border-[3px] border-ink transition ${
                      selected
                        ? "-translate-y-0.5 shadow-ink-sm ring-4 ring-sun"
                        : "opacity-75 group-hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={av.iconSrc}
                      alt=""
                      fill
                      sizes="72px"
                      unoptimized
                      className="object-cover"
                    />
                  </span>
                  <span
                    className={`text-xs ${
                      selected ? "font-extrabold text-ink" : "font-semibold text-ink/60"
                    }`}
                  >
                    {av.shortName}
                  </span>
                </button>
              );
            })}
          </div>
          {!selfie && (
            <p className="mt-4 text-sm text-ink/70">
              <span className="font-extrabold text-ink">{avatar.shortName}:</span>{" "}
              {avatar.quote}
            </p>
          )}
          <SelfiePicker selfie={selfie} onChange={setSelfie} />
        </Field>

        <Field label="Will you be there?">
          <div className="grid gap-3 sm:grid-cols-2" role="radiogroup">
            {(
              [
                {
                  value: "yes",
                  title: "Yes, I'll be there",
                  sub: `See you on ${EVENT_CONFIG.dateDisplay}`,
                  active: "bg-luffy text-white",
                },
                {
                  value: "no",
                  title: "Can't make it",
                  sub: "Sending love from afar",
                  active: "bg-ink text-white",
                },
              ] as const
            ).map((opt) => {
              const selected = attending === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setAttending(opt.value)}
                  className={`rounded-xl border-[3px] border-ink px-4 py-3.5 text-left transition ${
                    selected
                      ? `${opt.active} translate-x-[2px] translate-y-[2px] shadow-none`
                      : "bg-white shadow-ink-sm hover:bg-sun/30"
                  }`}
                >
                  <span className="block text-base font-extrabold">{opt.title}</span>
                  <span
                    className={`block text-sm ${selected ? "text-white/80" : "text-ink/60"}`}
                  >
                    {opt.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </Field>

        {attending === "yes" && (
          <Field
            label="Bringing anyone?"
            hint={`Up to ${EVENT_CONFIG.maxPlusOnes} plus-ones, no names needed`}
          >
            <div className="flex flex-wrap items-center gap-4">
              <div
                className="inline-flex overflow-hidden rounded-xl border-[3px] border-ink bg-white shadow-ink-sm"
                role="radiogroup"
              >
                {[0, 1, 2].slice(0, EVENT_CONFIG.maxPlusOnes + 1).map((n, i) => {
                  const selected = plusOnes === n;
                  return (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setPlusOnes(n)}
                      className={`px-5 py-2.5 text-sm font-extrabold transition ${
                        i > 0 ? "border-l-[3px] border-ink" : ""
                      } ${selected ? "bg-sun" : "hover:bg-sun/30"}`}
                    >
                      {n === 0 ? "Just me" : `+${n}`}
                    </button>
                  );
                })}
              </div>
              <span className="text-sm font-semibold text-ink/60">
                {seats} {seats === 1 ? "seat" : "seats"} reserved
              </span>
            </div>
          </Field>
        )}

        <Field label="Dress code" hint="Crew color palette">
          <div className="rounded-xl border-2 border-dashed border-ink/25 bg-white/60 p-4">
            <p className="mb-3.5 text-xs font-bold text-ink/75 sm:text-sm">
              Come dressed in any of our party colors:
            </p>
            <DressCodePalette />
          </div>
        </Field>

        <Field label={`A note for ${EVENT_CONFIG.honoreeDisplay}`} hint="Optional" htmlFor="note">
          <textarea
            id="note"
            rows={3}
            maxLength={350}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="A blessing, a wish, or a message for the family"
            className="w-full resize-none rounded-lg border-[3px] border-ink bg-white px-4 py-3 text-base font-semibold text-ink outline-none transition placeholder:text-ink/35 focus:ring-4 focus:ring-sun/70"
          />
        </Field>

        {error && (
          <p
            role="alert"
            className="rounded-lg border-2 border-luffy bg-luffy/10 px-4 py-3 text-sm font-bold text-luffy-dark"
          >
            {error}
          </p>
        )}

        <button type="submit" disabled={isPending} className="btn-plank w-full">
          {isPending ? "Sending…" : "Send my RSVP"}
        </button>

        <p className="text-center lg:hidden">
          <a
            href="#poster-preview"
            className="text-sm font-extrabold text-ink/70 underline underline-offset-4 hover:text-luffy"
          >
            Preview your Wanted poster ↓
          </a>
        </p>
      </form>
    </div>
  );
}

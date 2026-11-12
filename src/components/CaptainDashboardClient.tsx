"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Trash2 } from "lucide-react";
import { RsvpRecord } from "@/lib/store";
import { EVENT_CONFIG, PIRATE_AVATARS } from "@/config/event";
import {
  verifyCaptainPasscodeAction,
  logoutCaptainAction,
  removeRsvpAction,
} from "@/app/actions";
import { BerrySymbol } from "@/components/WantedPoster";
import { Cloud, Waves } from "@/components/Scenery";
import SiteFooter from "@/components/SiteFooter";

export function CaptainLoginGate() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await verifyCaptainPasscodeAction(passcode);
      if (!res.ok) {
        setError(res.error || "Invalid passcode");
      }
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-azure px-4 pb-32 pt-14">
        <Cloud className="absolute -left-10 top-8 w-44 animate-drift sm:w-64" />
        <Cloud className="absolute -right-8 top-24 w-36 animate-drift [animation-delay:-4s] sm:w-52" />

        <div className="relative z-10 w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-block">
              <span className="ink-title text-4xl sm:text-5xl">
                Captain&apos;s Log
              </span>
            </Link>
          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-6 rounded-2xl border-[3px] border-ink bg-paper p-6 shadow-ink-lg sm:p-8"
          >
            <div className="flex items-center gap-3">
              <Image
                src="/op-icons/Sail.png"
                alt="Jolly Roger"
                width={48}
                height={48}
                unoptimized
                className="h-12 w-12 rounded-xl border-[3px] border-ink shadow-ink-sm"
              />
              <div>
                <h1 className="font-display text-2xl tracking-wide text-ink">
                  Host Login
                </h1>
                <p className="text-sm font-semibold text-ink/65">
                  View {EVENT_CONFIG.honoreeDisplay}&apos;s guest list
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="captain-passcode"
                className="font-display text-lg tracking-wide text-ink"
              >
                Passcode
              </label>
              <input
                id="captain-passcode"
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError(null);
                }}
                placeholder="Enter host passcode"
                className="mt-2 w-full rounded-lg border-[3px] border-ink bg-white px-4 py-3 text-base font-bold text-ink outline-none transition placeholder:font-semibold placeholder:text-ink/35 focus:ring-4 focus:ring-sun/70"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border-2 border-luffy bg-luffy/10 px-4 py-3 text-sm font-bold text-luffy-dark"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="btn-plank w-full"
            >
              {isPending ? "Unlocking…" : "Open logbook"}
            </button>

            <div className="text-center">
              <Link
                href="/"
                className="text-sm font-extrabold text-ink/70 underline underline-offset-4 hover:text-luffy"
              >
                Back to the invitation
              </Link>
            </div>
          </form>
        </div>

        <Waves className="absolute inset-x-0 bottom-0" />
      </main>
      <SiteFooter />
    </div>
  );
}

const navBtn =
  "rounded-lg border-[3px] border-ink bg-paper px-4 py-2 text-sm font-extrabold text-ink shadow-ink-sm transition hover:bg-sun active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";

export default function CaptainDashboardClient({
  records,
  storageMode,
}: {
  records: RsvpRecord[];
  storageMode: "supabase" | "local";
}) {
  const [filter, setFilter] = useState<"all" | "yes" | "no">("all");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const yesRecords = records.filter((r) => r.attending === "yes");
  const noRecords = records.filter((r) => r.attending === "no");

  const confirmedCaptains = yesRecords.length;
  const confirmedNakama = yesRecords.reduce((acc, r) => acc + r.plus_ones, 0);
  const confirmedTotalSeats = confirmedCaptains + confirmedNakama;
  const totalFleetBounty = yesRecords.reduce((acc, r) => acc + r.bounty, 0);

  const filteredRecords = records.filter((r) => {
    if (filter !== "all" && r.attending !== filter) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.epithet.toLowerCase().includes(q) ||
        (r.message && r.message.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleExportCsv = () => {
    const headers = [
      "Name",
      "Epithet",
      "Character",
      "Attending",
      "Plus Ones",
      "Total Seats",
      "Bounty (Berries)",
      "Note",
      "Submitted At",
    ];

    const rows = records.map((r) => {
      const totalSeats = r.attending === "no" ? 0 : 1 + r.plus_ones;
      const escapeCsv = (val: string | number | null) => {
        const str = val === null || val === undefined ? "" : String(val);
        return `"${str.replace(/"/g, '""')}"`;
      };
      return [
        escapeCsv(r.name),
        escapeCsv(r.epithet),
        escapeCsv(r.avatar),
        escapeCsv(r.attending === "yes" ? "YES" : "NO"),
        escapeCsv(r.plus_ones),
        escapeCsv(totalSeats),
        escapeCsv(r.bounty),
        escapeCsv(r.message || ""),
        escapeCsv(new Date(r.created_at).toLocaleString()),
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `einarr-christening-rsvps-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: string, guestName: string) => {
    if (!window.confirm(`Remove "${guestName}" from the guest list?`)) return;
    startTransition(async () => {
      await removeRsvpAction(id);
    });
  };

  const handleLogout = () => {
    startTransition(async () => {
      await logoutCaptainAction();
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Sky Header */}
        <section className="relative overflow-hidden bg-azure px-4 pb-24 pt-10 sm:px-6 sm:pb-28">
          <Cloud className="absolute -left-10 top-4 w-40 animate-drift sm:w-56" />
          <Cloud className="absolute -right-8 top-10 w-36 animate-drift [animation-delay:-4s] sm:w-52" />

          <div className="relative mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-block rounded-md border-2 border-ink bg-white px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider text-ink shadow-[2px_2px_0_#1b1b1f]">
                {storageMode === "supabase"
                  ? "Supabase Live"
                  : "Local Preview (.data/rsvps.json)"}
              </span>
              <h1 className="ink-title mt-3 text-5xl sm:text-6xl">
                Captain&apos;s Log
              </h1>
              <p className="mt-3 text-sm font-extrabold text-ink/80 sm:text-base">
                {EVENT_CONFIG.honoreeDisplay}&apos;s Christening ·{" "}
                {EVENT_CONFIG.dateLong} ·{" "}
                <a
                  href={EVENT_CONFIG.venueMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-ink/40 decoration-2 underline-offset-4 hover:text-luffy hover:decoration-luffy"
                >
                  {EVENT_CONFIG.venueDisplay} ↗
                </a>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/" className={navBtn}>
                View invite
              </Link>
              <button
                type="button"
                onClick={handleExportCsv}
                className={`${navBtn} !bg-sun hover:!bg-sun-dark`}
              >
                Export CSV
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isPending}
                className={`${navBtn} !bg-ink !text-white hover:!bg-luffy`}
              >
                Lock
              </button>
            </div>
          </div>

          <Waves className="absolute inset-x-0 bottom-0" />
        </section>

        {/* Ocean Dashboard Body */}
        <section className="bg-sea px-4 pb-20 pt-4 sm:px-6">
          <div className="mx-auto max-w-6xl space-y-8">
            {/* Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border-[3px] border-ink bg-paper p-5 shadow-ink">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-wood">
                    Confirmed seats
                  </span>
                  <Image
                    src="/op-icons/Sunny.png"
                    alt=""
                    width={32}
                    height={32}
                    unoptimized
                    className="h-8 w-8 rounded-lg border-2 border-ink"
                  />
                </div>
                <p className="mt-2 font-display text-4xl text-luffy">
                  {confirmedTotalSeats}
                </p>
                <p className="mt-1 text-xs font-bold text-ink/65">
                  {confirmedCaptains} guests + {confirmedNakama} plus-ones
                </p>
              </div>

              <div className="rounded-2xl border-[3px] border-ink bg-paper p-5 shadow-ink">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-wood">
                    Attending
                  </span>
                  <Image
                    src="/op-icons/Sail.png"
                    alt=""
                    width={32}
                    height={32}
                    unoptimized
                    className="h-8 w-8 rounded-lg border-2 border-ink"
                  />
                </div>
                <p className="mt-2 font-display text-4xl text-ink">
                  {yesRecords.length}
                </p>
                <p className="mt-1 text-xs font-bold text-ink/65">
                  Out of {records.length} total RSVPs
                </p>
              </div>

              <div className="rounded-2xl border-[3px] border-ink bg-paper p-5 shadow-ink">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-wood">
                    Can&apos;t make it
                  </span>
                  <Image
                    src="/op-icons/Compass.png"
                    alt=""
                    width={32}
                    height={32}
                    unoptimized
                    className="h-8 w-8 rounded-lg border-2 border-ink"
                  />
                </div>
                <p className="mt-2 font-display text-4xl text-ink">
                  {noRecords.length}
                </p>
                <p className="mt-1 text-xs font-bold text-ink/65">
                  Sending love from afar
                </p>
              </div>

              <div className="rounded-2xl border-[3px] border-ink bg-paper p-5 shadow-ink">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-wood">
                    Fleet bounty
                  </span>
                  <BerrySymbol className="h-6 w-5 text-ink" />
                </div>
                <div className="mt-2 flex items-center gap-1.5 font-wanted text-2xl font-black text-ink sm:text-3xl">
                  <BerrySymbol className="h-6 w-5 shrink-0" />
                  <span className="tabular-nums">
                    {totalFleetBounty.toLocaleString("en-US")}
                  </span>
                </div>
                <p className="mt-1 text-xs font-bold text-ink/65">
                  Combined berries attending
                </p>
              </div>
            </div>

            {/* Guest List Card */}
            <div className="space-y-5 rounded-2xl border-[3px] border-ink bg-paper p-5 shadow-ink-lg sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Filter Segmented Control */}
                <div
                  className="inline-flex overflow-hidden rounded-xl border-[3px] border-ink bg-white shadow-ink-sm"
                  role="tablist"
                >
                  {(
                    [
                      { id: "all", label: `All (${records.length})` },
                      { id: "yes", label: `Attending (${yesRecords.length})` },
                      { id: "no", label: `Not attending (${noRecords.length})` },
                    ] as const
                  ).map((tab, i) => {
                    const active = filter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setFilter(tab.id)}
                        className={`px-4 py-2 text-xs font-extrabold transition sm:text-sm ${
                          i > 0 ? "border-l-[3px] border-ink" : ""
                        } ${active ? "bg-sun" : "hover:bg-sun/30"}`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Search */}
                <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/45" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search guest or note…"
                    className="w-full rounded-lg border-[3px] border-ink bg-white py-2 pl-10 pr-3 text-sm font-bold text-ink outline-none transition placeholder:font-semibold placeholder:text-ink/35 focus:ring-4 focus:ring-sun/70"
                  />
                </div>
              </div>

              {filteredRecords.length === 0 ? (
                <div className="rounded-xl border-[3px] border-dashed border-ink/25 bg-white/60 py-14 text-center">
                  <Image
                    src="/op-icons/Sunny.png"
                    alt=""
                    width={52}
                    height={52}
                    unoptimized
                    className="mx-auto mb-3 h-13 w-13 rounded-xl border-2 border-ink"
                  />
                  <p className="font-display text-2xl tracking-wide text-ink">
                    No RSVPs yet
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink/60">
                    Share your invitation link so guests can print their posters.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border-[3px] border-ink bg-white">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b-[3px] border-ink bg-paper-dark/50 text-xs font-extrabold uppercase tracking-wider text-ink/75">
                        <th className="px-4 py-3">Guest</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Plus-ones</th>
                        <th className="px-4 py-3">Seats</th>
                        <th className="px-4 py-3">Bounty</th>
                        <th className="px-4 py-3">Note</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3 text-right">Remove</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-ink/10 text-sm">
                      {filteredRecords.map((r) => {
                        const avatarObj =
                          PIRATE_AVATARS.find((a) => a.id === r.avatar) ??
                          PIRATE_AVATARS[0];
                        const seats = r.attending === "no" ? 0 : 1 + r.plus_ones;

                        return (
                          <tr
                            key={r.id}
                            className="transition hover:bg-paper/40"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <Image
                                  src={avatarObj.iconSrc}
                                  alt={avatarObj.shortName}
                                  width={36}
                                  height={36}
                                  unoptimized
                                  className="h-9 w-9 shrink-0 rounded-lg border-2 border-ink object-cover"
                                />
                                <div>
                                  <Link
                                    href={`/thanks/${r.id}`}
                                    className="font-extrabold text-ink underline decoration-ink/30 decoration-2 underline-offset-2 hover:text-luffy hover:decoration-luffy"
                                  >
                                    {r.name}
                                  </Link>
                                  <p className="text-xs italic text-ink/60">
                                    &ldquo;{r.epithet}&rdquo;
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-3">
                              <span
                                className={`inline-block rounded-md border-2 border-ink px-2.5 py-0.5 text-xs font-extrabold ${
                                  r.attending === "yes"
                                    ? "bg-luffy text-white"
                                    : "bg-paper text-ink"
                                }`}
                              >
                                {r.attending === "yes"
                                  ? "Attending"
                                  : "Not attending"}
                              </span>
                            </td>

                            <td className="px-4 py-3 font-bold">
                              {r.attending === "no" ? (
                                <span className="text-ink/35">—</span>
                              ) : r.plus_ones > 0 ? (
                                <span className="font-extrabold text-luffy">
                                  +{r.plus_ones}
                                </span>
                              ) : (
                                <span className="text-ink/60">Just them</span>
                              )}
                            </td>

                            <td className="px-4 py-3 font-extrabold">
                              {seats}
                            </td>

                            <td className="px-4 py-3 font-wanted text-xs font-black tabular-nums">
                              ฿{r.bounty.toLocaleString("en-US")}
                            </td>

                            <td className="max-w-xs px-4 py-3">
                              {r.message ? (
                                <p className="line-clamp-2 text-xs italic text-ink/75">
                                  &ldquo;{r.message}&rdquo;
                                </p>
                              ) : (
                                <span className="text-xs text-ink/35">—</span>
                              )}
                            </td>

                            <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-ink/60">
                              {new Date(r.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </td>

                            <td className="px-4 py-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleDelete(r.id, r.name)}
                                disabled={isPending}
                                title="Remove RSVP"
                                className="rounded-md p-1.5 text-ink/45 transition hover:bg-luffy/10 hover:text-luffy"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Download,
  Lock,
  LogOut,
  Search,
  Trash2,
  Database,
  ArrowLeft,
} from "lucide-react";
import { RsvpRecord } from "@/lib/store";
import { EVENT_CONFIG, PIRATE_AVATARS } from "@/config/event";
import {
  verifyCaptainPasscodeAction,
  logoutCaptainAction,
  removeRsvpAction,
} from "@/app/actions";
import { BerrySymbol } from "@/components/WantedPoster";

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleLogin}
        className="max-w-md w-full bg-[#f6e7c5] text-parchment-ink border-[3px] border-parchment-ink p-7 rounded-sm shadow-2xl space-y-5"
      >
        <div className="flex items-center gap-2.5 text-crimson">
          <Lock className="w-6 h-6" />
          <span className="text-xs font-baby font-extrabold uppercase tracking-widest">
            Fleet Admiral Quarters
          </span>
        </div>

        <div>
          <h1 className="font-wanted font-black text-3xl uppercase tracking-wide">
            Captain&apos;s Log Login
          </h1>
          <p className="text-xs font-baby text-parchment-ink/75 mt-1">
            Enter the secret cipher to view Baby {EVENT_CONFIG.honoreeName}&apos;s
            Christening RSVP list &amp; headcount.
          </p>
        </div>

        <div>
          <label className="block text-xs font-baby font-extrabold uppercase tracking-wider mb-1">
            Secret Cipher Passcode
          </label>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Enter passcode (default: gomugomu)"
            className="w-full bg-parchment-light border-2 border-parchment-ink px-3.5 py-2.5 rounded-sm font-bold text-parchment-ink focus:outline-none focus:ring-2 focus:ring-crimson font-baby"
          />
        </div>

        {error && (
          <p className="text-xs font-baby font-bold text-crimson bg-crimson/10 border border-crimson px-3 py-2 rounded-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-crimson hover:bg-crimson-dark text-parchment-light border-2 border-parchment-ink py-3 font-wanted font-bold text-xl uppercase tracking-wide shadow-[0_4px_0_#2b1d0e] active:translate-y-1 active:shadow-none transition"
        >
          {isPending ? "Unlocking Logbook..." : "Open Captain's Log"}
        </button>

        <div className="text-center pt-1">
          <Link
            href="/"
            className="text-xs font-baby font-bold underline text-parchment-ink/70 hover:text-crimson"
          >
            ← Back to Invitation Page
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function CaptainDashboardClient({
  records,
  storageMode,
}: {
  records: RsvpRecord[];
  storageMode: "supabase" | "local";
}) {
  // Only 2 statuses: "all", "yes", "no"
  const [filter, setFilter] = useState<"all" | "yes" | "no">("all");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  // Compute Headcount & Stats (strictly 2 options: yes vs no)
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
      "Plus Ones (Nakama)",
      "Total Seats",
      "Bounty (Berries)",
      "Message",
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
        escapeCsv(r.attending === "yes" ? "ATTENDING (YES)" : "DECLINED (NO)"),
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
    link.download = `baby-einarr-christening-rsvps-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: string, guestName: string) => {
    if (!window.confirm(`Remove "${guestName}" from the ship's log?`)) return;
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
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-10 max-w-6xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#f6e7c5] text-parchment-ink border-[3px] border-parchment-ink p-5 rounded-sm shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-crimson text-parchment-light text-[10px] font-baby font-extrabold uppercase tracking-widest rounded-sm">
              HOST DASHBOARD
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-baby font-extrabold uppercase tracking-wider rounded-sm border ${
                storageMode === "supabase"
                  ? "bg-emerald-800 text-white border-emerald-950"
                  : "bg-amber-200 text-parchment-ink border-parchment-ink"
              }`}
            >
              <Database className="w-3 h-3" />
              {storageMode === "supabase"
                ? "Supabase Postgres Live"
                : "Local Preview Storage (.data/rsvps.json)"}
            </span>
          </div>
          <h1 className="font-wanted font-black text-2xl sm:text-3xl uppercase tracking-wide mt-1">
            Baby {EVENT_CONFIG.honoreeName}&apos;s Christening Fleet Logbook
          </h1>
          <p className="text-xs font-baby font-bold text-parchment-ink/75">
            {EVENT_CONFIG.occasion} • {EVENT_CONFIG.dateDisplay},{" "}
            {EVENT_CONFIG.yearDisplay} • {EVENT_CONFIG.venueName}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 bg-parchment-light hover:bg-parchment-DEFAULT text-parchment-ink border-2 border-parchment-ink px-3.5 py-2 rounded-sm text-xs font-baby font-extrabold uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            View Invite
          </Link>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 bg-gold-bright hover:bg-gold text-parchment-ink border-2 border-parchment-ink px-4 py-2 rounded-sm text-xs font-baby font-extrabold uppercase tracking-wider shadow-[0_3px_0_#2b1d0e] active:translate-y-0.5 active:shadow-none"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 bg-parchment-ink text-parchment-light px-3.5 py-2 rounded-sm text-xs font-baby font-extrabold uppercase tracking-wider hover:bg-crimson transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Lock
          </button>
        </div>
      </div>

      {/* KPI STAT CARDS (WITH ONE PIECE ICONS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CONFIRMED HEADCOUNT */}
        <div className="bg-[#f6e7c5] text-parchment-ink border-[3px] border-parchment-ink p-4 rounded-sm shadow-lg">
          <div className="flex items-center justify-between text-xs font-baby font-extrabold uppercase tracking-wider text-parchment-ink/70">
            <span>Confirmed Headcount</span>
            <Image
              src="/op-icons/Sunny.png"
              alt="Thousand Sunny"
              width={24}
              height={24}
              unoptimized
              className="w-6 h-6 object-contain"
            />
          </div>
          <p className="font-wanted font-black text-4xl text-crimson mt-1">
            {confirmedTotalSeats}{" "}
            <span className="text-base font-baby text-parchment-ink">Seats</span>
          </p>
          <p className="text-xs font-baby font-bold text-parchment-ink/80 mt-1">
            {confirmedCaptains} Primary + {confirmedNakama} Nakama (+1s)
          </p>
        </div>

        {/* SETTING SAIL (YES) */}
        <div className="bg-[#f6e7c5] text-parchment-ink border-[3px] border-parchment-ink p-4 rounded-sm shadow-lg">
          <div className="flex items-center justify-between text-xs font-baby font-extrabold uppercase tracking-wider text-parchment-ink/70">
            <span>Setting Sail (Yes)</span>
            <Image
              src="/op-icons/Sail.png"
              alt="Sail"
              width={24}
              height={24}
              unoptimized
              className="w-6 h-6 object-contain"
            />
          </div>
          <p className="font-wanted font-black text-4xl text-parchment-ink mt-1">
            {yesRecords.length}{" "}
            <span className="text-base font-baby text-parchment-ink/70">RSVPs</span>
          </p>
          <p className="text-xs font-baby font-bold text-parchment-ink/80 mt-1">
            Out of {records.length} total responses
          </p>
        </div>

        {/* ANCHORED AFAR (NO) */}
        <div className="bg-[#f6e7c5] text-parchment-ink border-[3px] border-parchment-ink p-4 rounded-sm shadow-lg">
          <div className="flex items-center justify-between text-xs font-baby font-extrabold uppercase tracking-wider text-parchment-ink/70">
            <span>Anchored Afar (Declined)</span>
            <Image
              src="/op-icons/Compass.png"
              alt="Log Pose"
              width={24}
              height={24}
              unoptimized
              className="w-6 h-6 object-contain"
            />
          </div>
          <p className="font-wanted font-black text-4xl text-parchment-ink mt-1">
            {noRecords.length}{" "}
            <span className="text-base font-baby text-parchment-ink/70">Guests</span>
          </p>
          <p className="text-xs font-baby font-bold text-parchment-ink/80 mt-1">
            Sending love &amp; blessings
          </p>
        </div>

        {/* TOTAL FLEET BOUNTY */}
        <div className="bg-[#f6e7c5] text-parchment-ink border-[3px] border-parchment-ink p-4 rounded-sm shadow-lg">
          <div className="flex items-center justify-between text-xs font-baby font-extrabold uppercase tracking-wider text-parchment-ink/70">
            <span>Total Fleet Bounty</span>
            <BerrySymbol className="w-5 h-5 text-crimson" />
          </div>
          <div className="flex items-center gap-1 font-wanted font-black text-2xl sm:text-3xl text-parchment-ink mt-2">
            <BerrySymbol className="w-5 h-5" />
            <span>{totalFleetBounty.toLocaleString("en-US")}</span>
          </div>
          <p className="text-xs font-baby font-bold text-parchment-ink/80 mt-1">
            Combined Berries of attending crew
          </p>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-[#f6e7c5] text-parchment-ink border-[3px] border-parchment-ink p-4 rounded-sm shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all" as const, label: `All (${records.length})` },
              {
                id: "yes" as const,
                label: `Setting Sail (${yesRecords.length})`,
              },
              {
                id: "no" as const,
                label: `Anchored Afar (${noRecords.length})`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-sm text-xs font-baby font-extrabold uppercase tracking-wider border-2 border-parchment-ink transition ${
                  filter === tab.id
                    ? "bg-crimson text-parchment-light"
                    : "bg-parchment-light hover:bg-parchment-DEFAULT text-parchment-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-[220px] max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-parchment-ink/50" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pirate name or message..."
              className="w-full bg-parchment-light border-2 border-parchment-ink pl-9 pr-3 py-1.5 rounded-sm text-xs font-bold text-parchment-ink placeholder:text-parchment-ink/50 focus:outline-none font-baby"
            />
          </div>
        </div>

        {/* GUEST TABLE */}
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-parchment-ink/40 rounded-sm">
            <div className="w-12 h-12 mx-auto mb-2 relative">
              <Image
                src="/op-icons/Sunny.png"
                alt="Thousand Sunny"
                width={48}
                height={48}
                unoptimized
                className="w-full h-full object-contain"
              />
            </div>
            <p className="font-wanted font-black text-xl uppercase tracking-wide">
              No Pirate Bounties Found
            </p>
            <p className="text-xs font-baby text-parchment-ink/70 mt-1">
              Share your invitation link so guests can register their Wanted posters!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-parchment-ink text-[11px] font-baby font-extrabold uppercase tracking-wider text-parchment-ink/80 bg-parchment-dark/40">
                  <th className="py-2.5 px-3">Pirate &amp; Character</th>
                  <th className="py-2.5 px-3">Attendance</th>
                  <th className="py-2.5 px-3">Nakama (+1s)</th>
                  <th className="py-2.5 px-3">Seats</th>
                  <th className="py-2.5 px-3">Bounty</th>
                  <th className="py-2.5 px-3">Message in Bottle</th>
                  <th className="py-2.5 px-3">Registered</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-parchment-ink/25 text-sm font-baby">
                {filteredRecords.map((r) => {
                  const avatarObj =
                    PIRATE_AVATARS.find((a) => a.id === r.avatar) ||
                    PIRATE_AVATARS[0];
                  const seats = r.attending === "no" ? 0 : 1 + r.plus_ones;

                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-parchment-light/70 transition"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <Image
                            src={avatarObj.iconSrc}
                            alt={avatarObj.label}
                            width={32}
                            height={32}
                            unoptimized
                            className="w-8 h-8 object-contain rounded-lg drop-shadow shrink-0"
                          />
                          <div>
                            <Link
                              href={`/thanks/${r.id}`}
                              className="font-extrabold text-parchment-ink hover:text-crimson underline font-wanted tracking-wide"
                            >
                              {r.name}
                            </Link>
                            <p className="text-xs font-baby text-crimson">
                              &ldquo;{r.epithet}&rdquo;
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-sm text-[11px] font-baby font-extrabold uppercase tracking-wider border border-parchment-ink ${
                            r.attending === "yes"
                              ? "bg-emerald-700 text-white"
                              : "bg-parchment-dark text-parchment-ink"
                          }`}
                        >
                          {r.attending === "yes" ? "Aye! (Setting Sail)" : "No (Anchored)"}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-bold">
                        {r.attending === "no" ? (
                          <span className="text-parchment-ink/40">—</span>
                        ) : r.plus_ones > 0 ? (
                          <span className="text-crimson font-extrabold">
                            +{r.plus_ones} Nakama
                          </span>
                        ) : (
                          <span className="text-parchment-ink/70">Solo (0)</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-wanted font-bold text-base">
                          {seats} {seats === 1 ? "Seat" : "Seats"}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-bold tabular-nums text-xs font-wanted">
                        ฿{r.bounty.toLocaleString("en-US")}
                      </td>

                      <td className="py-3 px-3 max-w-xs">
                        {r.message ? (
                          <p className="text-xs italic text-parchment-ink/90 line-clamp-2">
                            &ldquo;{r.message}&rdquo;
                          </p>
                        ) : (
                          <span className="text-xs text-parchment-ink/40">—</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-xs text-parchment-ink/70 whitespace-nowrap">
                        {new Date(r.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(r.id, r.name)}
                          disabled={isPending}
                          title="Remove entry"
                          className="p-1.5 text-parchment-ink/60 hover:text-crimson transition"
                        >
                          <Trash2 className="w-4 h-4" />
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
    </main>
  );
}

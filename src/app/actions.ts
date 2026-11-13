"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { createRsvp, deleteRsvpById } from "@/lib/store";
import { sendRsvpEmails } from "@/lib/email";
import { EVENT_CONFIG, getEpithetForName, calculateBounty } from "@/config/event";

const RsvpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Even Luffy wrote his name! Type your pirate name first.")
    .max(60, "Whoa there! Keep your name under 60 characters, Captain."),
  epithet: z.string().trim().max(80).optional(),
  bounty: z.coerce.number().min(0).max(99_999_999_999).optional(),
  avatar: z
    .string()
    .trim()
    .min(1)
    .max(350_000, "Selfie image is too large; please try a smaller photo.")
    .refine(
      (val) =>
        val.length <= 40 ||
        /^data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(val),
      "Invalid flag or selfie image format."
    )
    .default("luffy"),
  attending: z.enum(["yes", "no"]),
  plus_ones: z.coerce
    .number()
    .int()
    .min(0)
    .max(EVENT_CONFIG.maxPlusOnes)
    .default(0),
  message: z
    .string()
    .trim()
    .max(350, "Message in a bottle can only hold 350 characters!")
    .optional(),
  email: z
    .string()
    .trim()
    .max(120, "Email address is too long.")
    .refine(
      (val) => val === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "Please enter a valid email address or leave it blank."
    )
    .optional(),
  honeypot: z.string().optional(),
});

export type SubmitRsvpResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function submitRsvpAction(
  payload: Record<string, unknown>
): Promise<SubmitRsvpResult> {
  try {
    // Spam honeypot guard
    if (payload.honeypot && String(payload.honeypot).trim().length > 0) {
      return { ok: false, error: "Marine cipher interception blocked." };
    }

    const parsed = RsvpSchema.safeParse(payload);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return {
        ok: false,
        error: firstIssue?.message || "Please check your bounty details!",
      };
    }

    const data = parsed.data;
    const effectivePlusOnes = data.attending === "no" ? 0 : data.plus_ones;
    const finalEpithet =
      data.epithet && data.epithet.length > 0
        ? data.epithet
        : getEpithetForName(data.name, 0);
    const finalBounty =
      data.bounty && data.bounty > 0
        ? data.bounty
        : calculateBounty(data.name, effectivePlusOnes, data.attending, 0);

    const record = await createRsvp({
      name: data.name,
      epithet: finalEpithet,
      bounty: finalBounty,
      avatar: data.avatar,
      attending: data.attending,
      plus_ones: effectivePlusOnes,
      message: data.message || null,
    });

    revalidatePath("/captain");

    const guestEmail = data.email && data.email.length > 0 ? data.email : null;
    after(async () => {
      try {
        await sendRsvpEmails(record, guestEmail);
      } catch (err) {
        console.error("Background RSVP email dispatch failed:", err);
      }
    });

    return { ok: true, id: record.id };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Den Den Mushi lost signal! Please try again.";
    return { ok: false, error: message };
  }
}

const CAPTAIN_COOKIE = "einarr_captain_session";

function getExpectedPasscode(): string {
  return process.env.CAPTAIN_PASSCODE || "gomugomu";
}

export async function isCaptainAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CAPTAIN_COOKIE)?.value;
  return token === "authenticated";
}

export async function verifyCaptainPasscodeAction(
  passcode: string
): Promise<{ ok: boolean; error?: string }> {
  const expected = getExpectedPasscode();
  if (passcode.trim() !== expected) {
    return {
      ok: false,
      error: "Wrong Marine cipher code! (Hint: default is 'gomugomu')",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(CAPTAIN_COOKIE, "authenticated", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14, // 14 days
  });

  revalidatePath("/captain");
  return { ok: true };
}

export async function logoutCaptainAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CAPTAIN_COOKIE);
  revalidatePath("/captain");
}

export async function removeRsvpAction(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  const authed = await isCaptainAuthenticated();
  if (!authed) {
    return { ok: false, error: "Unauthorized." };
  }
  try {
    await deleteRsvpById(id);
    revalidatePath("/captain");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to remove entry",
    };
  }
}


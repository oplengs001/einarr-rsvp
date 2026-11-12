import { createClient, SupabaseClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";

export type AttendanceStatus = "yes" | "no";

export interface RsvpRecord {
  id: string;
  name: string;
  epithet: string;
  bounty: number;
  avatar: string;
  attending: AttendanceStatus;
  plus_ones: number;
  message: string | null;
  created_at: string;
}

export interface CreateRsvpInput {
  name: string;
  epithet: string;
  bounty: number;
  avatar: string;
  attending: AttendanceStatus;
  plus_ones: number;
  message?: string | null;
}

const LOCAL_DATA_FILE = path.join(process.cwd(), ".data", "rsvps.json");

// Fallback in-memory cache if filesystem is read-only and Supabase is not yet set
let memoryFallback: RsvpRecord[] = [];

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  if (url.includes("your-project-id.supabase.co")) return false;
  if (key.includes("your-service-role-secret-key")) return false;
  return true;
}

function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function readLocalRsvps(): Promise<RsvpRecord[]> {
  try {
    const raw = await fs.readFile(LOCAL_DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return memoryFallback;
  } catch {
    return memoryFallback;
  }
}

async function writeLocalRsvps(records: RsvpRecord[]): Promise<void> {
  memoryFallback = records;
  try {
    await fs.mkdir(path.dirname(LOCAL_DATA_FILE), { recursive: true });
    await fs.writeFile(
      LOCAL_DATA_FILE,
      JSON.stringify(records, null, 2),
      "utf8"
    );
  } catch {
    // Ignore fs errors on read-only environments; memoryFallback still holds state
  }
}

export async function createRsvp(input: CreateRsvpInput): Promise<RsvpRecord> {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data, error } = await supabase
      .from("rsvps")
      .insert({
        name: input.name,
        epithet: input.epithet,
        bounty: input.bounty,
        avatar: input.avatar,
        attending: input.attending,
        plus_ones: input.plus_ones,
        message: input.message || null,
      })
      .select("*")
      .single();

    if (error) {
      throw new Error(`Supabase insert failed: ${error.message}`);
    }

    return {
      ...data,
      bounty: Number(data.bounty),
      plus_ones: Number(data.plus_ones),
    } as RsvpRecord;
  }

  // Local fallback mode
  const existing = await readLocalRsvps();
  const newRecord: RsvpRecord = {
    id: crypto.randomUUID(),
    name: input.name,
    epithet: input.epithet,
    bounty: input.bounty,
    avatar: input.avatar,
    attending: input.attending,
    plus_ones: input.plus_ones,
    message: input.message || null,
    created_at: new Date().toISOString(),
  };

  existing.unshift(newRecord);
  await writeLocalRsvps(existing);
  return newRecord;
}

export async function getRsvpById(id: string): Promise<RsvpRecord | null> {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data, error } = await supabase
      .from("rsvps")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return {
      ...data,
      bounty: Number(data.bounty),
      plus_ones: Number(data.plus_ones),
    } as RsvpRecord;
  }

  const existing = await readLocalRsvps();
  return existing.find((r) => r.id === id) || null;
}

export async function listAllRsvps(): Promise<{
  records: RsvpRecord[];
  storageMode: "supabase" | "local";
}> {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data, error } = await supabase
      .from("rsvps")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Supabase query failed: ${error.message}`);
    }

    const records = (data || []).map((row) => ({
      ...row,
      bounty: Number(row.bounty),
      plus_ones: Number(row.plus_ones),
    })) as RsvpRecord[];

    return { records, storageMode: "supabase" };
  }

  const records = await readLocalRsvps();
  return { records, storageMode: "local" };
}

export async function deleteRsvpById(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { error } = await supabase.from("rsvps").delete().eq("id", id);
    if (error) {
      throw new Error(`Supabase delete failed: ${error.message}`);
    }
    return;
  }

  const existing = await readLocalRsvps();
  const filtered = existing.filter((r) => r.id !== id);
  await writeLocalRsvps(filtered);
}


import { NextResponse } from "next/server";
import { listAllRsvps } from "@/lib/store";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (cronSecret && authHeader && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { records, storageMode } = await listAllRsvps();
    return NextResponse.json({
      ok: true,
      storageMode,
      pingedAt: new Date().toISOString(),
      totalBounties: records.length,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Keepalive ping failed",
      },
      { status: 500 }
    );
  }
}


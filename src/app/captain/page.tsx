import React from "react";
import { isCaptainAuthenticated } from "@/app/actions";
import { listAllRsvps } from "@/lib/store";
import CaptainDashboardClient, {
  CaptainLoginGate,
} from "@/components/CaptainDashboardClient";

export const dynamic = "force-dynamic";

export default async function CaptainPage() {
  const authed = await isCaptainAuthenticated();

  if (!authed) {
    return <CaptainLoginGate />;
  }

  const { records, storageMode } = await listAllRsvps();

  return (
    <CaptainDashboardClient records={records} storageMode={storageMode} />
  );
}


import { NextResponse } from "next/server";

import { getRequiredSession } from "@/lib/auth/session";
import { syncGoogleAdsMetrics } from "@/integrations/google-ads/service";

export async function POST() {
  const session = await getRequiredSession();

  if (!session.user.organizationId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const count = await syncGoogleAdsMetrics(session.user.organizationId);
  return NextResponse.json({ ok: true, synced: count });
}

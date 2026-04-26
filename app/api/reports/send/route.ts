import { NextResponse } from "next/server";

import { getRequiredSession } from "@/lib/auth/session";
import { sendDailyReport } from "@/modules/reports/service";

export async function POST() {
  const session = await getRequiredSession();

  if (!session.user.organizationId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const delivery = await sendDailyReport(session.user.organizationId);
  return NextResponse.json({ ok: true, deliveryId: delivery.id });
}

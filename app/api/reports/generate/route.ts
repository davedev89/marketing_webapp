import { NextResponse } from "next/server";

import { getRequiredSession } from "@/lib/auth/session";
import { generateDailyReport } from "@/modules/reports/service";

export async function POST() {
  const session = await getRequiredSession();

  if (!session.user.organizationId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  const report = await generateDailyReport(session.user.organizationId);
  return NextResponse.json({ ok: true, reportId: report.id });
}

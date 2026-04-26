import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { runDueJobs } from "@/jobs/scheduler";

export async function POST(request: Request) {
  const secret = request.headers.get("x-cron-secret");

  if (secret !== env.CRON_SECRET) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const processed = await runDueJobs();
  return NextResponse.json({ ok: true, processed });
}

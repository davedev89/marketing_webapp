import { NextResponse } from "next/server";
import { JobType } from "@prisma/client";

import { getRequiredAdminSession } from "@/lib/auth/session";
import { enqueueJob } from "@/jobs/scheduler";

export async function POST(request: Request) {
  await getRequiredAdminSession();
  const body = await request.json();

  const job = await enqueueJob({
    organizationId: body.organizationId,
    jobType: (body.jobType as JobType) ?? JobType.GOOGLE_ADS_SYNC
  });

  return NextResponse.json({ ok: true, jobId: job.id });
}

import { NextResponse } from "next/server";

import { getRequiredAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  await getRequiredAdminSession();

  const reports = await prisma.dailyReport.findMany({
    orderBy: { createdAt: "desc" },
    take: 20
  });

  return NextResponse.json({ reports });
}

import { prisma } from "@/lib/db/prisma";

export async function runRefreshConnectionsJob() {
  return prisma.googleAdsConnection.updateMany({
    where: { status: "ACTIVE" },
    data: { lastRefreshAt: new Date() }
  });
}

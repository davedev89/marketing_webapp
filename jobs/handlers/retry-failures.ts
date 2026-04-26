import { prisma } from "@/lib/db/prisma";

export async function runRetryFailuresJob() {
  return prisma.scheduledJob.findMany({
    where: { status: "FAILED" },
    take: 10
  });
}

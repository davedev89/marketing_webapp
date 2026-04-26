import { JobType, JobStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { runGenerateDailyReportJob } from "@/jobs/handlers/generate-daily-report";
import { runGoogleAdsSyncJob } from "@/jobs/handlers/sync-google-ads";
import { runRefreshConnectionsJob } from "@/jobs/handlers/refresh-connections";
import { runRetryFailuresJob } from "@/jobs/handlers/retry-failures";
import { runSendWhatsAppReportJob } from "@/jobs/handlers/send-whatsapp-report";

export async function enqueueJob({
  organizationId,
  jobType,
  scheduledFor = new Date(),
  payload
}: {
  organizationId?: string;
  jobType: JobType;
  scheduledFor?: Date;
  payload?: Record<string, unknown>;
}) {
  const dedupeKey = `${jobType}:${organizationId ?? "global"}:${scheduledFor.toISOString()}`;

  return prisma.scheduledJob.upsert({
    where: { dedupeKey },
    update: {},
    create: {
      organizationId,
      jobType,
      scheduledFor,
      dedupeKey,
      payload: payload as Prisma.InputJsonValue | undefined
    }
  });
}

export async function runDueJobs() {
  const jobs = await prisma.scheduledJob.findMany({
    where: {
      status: JobStatus.PENDING,
      scheduledFor: { lte: new Date() }
    },
    orderBy: { scheduledFor: "asc" },
    take: 20
  });

  for (const job of jobs) {
    await prisma.scheduledJob.update({
      where: { id: job.id },
      data: {
        status: JobStatus.RUNNING,
        startedAt: new Date(),
        attemptCount: { increment: 1 }
      }
    });

    try {
      let result: unknown = null;
      if (job.jobType === "GOOGLE_ADS_SYNC" && job.organizationId) result = await runGoogleAdsSyncJob(job.organizationId);
      if (job.jobType === "GENERATE_DAILY_REPORT" && job.organizationId) result = await runGenerateDailyReportJob(job.organizationId);
      if (job.jobType === "SEND_DAILY_REPORT" && job.organizationId) result = await runSendWhatsAppReportJob(job.organizationId);
      if (job.jobType === "REFRESH_CONNECTION") result = await runRefreshConnectionsJob();
      if (job.jobType === "RETRY_DELIVERY") result = await runRetryFailuresJob();

      await prisma.scheduledJob.update({
        where: { id: job.id },
        data: {
          status: JobStatus.SUCCESS,
          finishedAt: new Date(),
          result: result as Prisma.InputJsonValue
        }
      });
    } catch (error) {
      await prisma.scheduledJob.update({
        where: { id: job.id },
        data: {
          status: JobStatus.FAILED,
          finishedAt: new Date(),
          errorMessage: error instanceof Error ? error.message : "Error desconocido"
        }
      });
    }
  }

  return jobs.length;
}

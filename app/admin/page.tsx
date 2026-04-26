import { Card } from "@/components/ui/card";
import { getRequiredAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils/format";
import type { DailyReport, GoogleAdsConnection, ScheduledJob } from "@prisma/client";

export default async function AdminPage() {
  await getRequiredAdminSession();

  const [connections, jobs, reports] = await Promise.all([
    prisma.googleAdsConnection.findMany({ orderBy: { updatedAt: "desc" }, take: 10 }),
    prisma.scheduledJob.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.dailyReport.findMany({ orderBy: { createdAt: "desc" }, take: 10 })
  ]);

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Admin técnico mínimo</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold">Conexiones</h2>
          {connections.map((connection: GoogleAdsConnection) => (
            <p key={connection.id} className="text-sm text-slate-600">
              {connection.selectedCustomerId ?? "Sin cuenta"} · {connection.status}
            </p>
          ))}
        </Card>
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold">Jobs</h2>
          {jobs.map((job: ScheduledJob) => (
            <p key={job.id} className="text-sm text-slate-600">
              {job.jobType} · {job.status}
            </p>
          ))}
        </Card>
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold">Últimos reportes</h2>
          {reports.map((report: DailyReport) => (
            <p key={report.id} className="text-sm text-slate-600">
              {formatDate(report.reportDate)} · {report.status}
            </p>
          ))}
        </Card>
      </div>
    </main>
  );
}

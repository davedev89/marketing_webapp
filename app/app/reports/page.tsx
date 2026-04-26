import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils/format";
import { getRequiredSession } from "@/lib/auth/session";
import { getOrganizationForUser } from "@/modules/organizations/service";
import type { DailyReport } from "@prisma/client";

export default async function ReportsPage() {
  const session = await getRequiredSession();
  const organization = await getOrganizationForUser(session.user.id);

  if (!organization?.dailyReports.length) {
    return <EmptyState title="Todavía no hay informes" description="Cuando corra el primer job diario, verás aquí el historial." ctaLabel="Completar onboarding" ctaHref="/onboarding" />;
  }

  return (
    <div className="space-y-4">
      {organization.dailyReports.map((report: DailyReport) => (
        <Card key={report.id} className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900">{report.headline ?? "Resumen diario"}</h2>
            <span className="text-sm text-slate-500">{formatDate(report.reportDate)}</span>
          </div>
          <p className="text-sm leading-7 text-slate-600">{report.summaryText}</p>
        </Card>
      ))}
    </div>
  );
}

import { generateDailyReport } from "@/modules/reports/service";

export async function runGenerateDailyReportJob(organizationId: string) {
  return generateDailyReport(organizationId);
}

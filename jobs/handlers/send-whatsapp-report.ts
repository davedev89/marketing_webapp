import { sendDailyReport } from "@/modules/reports/service";

export async function runSendWhatsAppReportJob(organizationId: string) {
  return sendDailyReport(organizationId);
}

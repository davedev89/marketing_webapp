import { ReportFormat, ReportStatus } from "@prisma/client";

import { generateText } from "@/lib/ai/client";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { formatMoney } from "@/lib/utils/format";
import { DAILY_REPORT_PROMPT } from "@/prompts/daily-report";
import { sendWhatsAppReport } from "@/providers/whatsapp/service";
import { logAuditEvent } from "@/modules/audit/service";

function buildReportContext(snapshots: Array<{ campaignName: string | null; conversions: unknown; costPerConversion: unknown; costMicros: bigint | null }>) {
  return {
    campaigns: snapshots.map((snapshot) => ({
      campaignName: snapshot.campaignName,
      conversions: Number(snapshot.conversions ?? 0),
      costPerConversion: Number(snapshot.costPerConversion ?? 0),
      cost: Number(snapshot.costMicros ?? BigInt(0)) / 1_000_000
    }))
  };
}

export async function generateDailyReport(organizationId: string) {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: {
      reportPreference: true,
      adAccounts: { where: { isPrimary: true }, take: 1 },
      reportSnapshots: { orderBy: { snapshotDate: "desc" }, take: 5 }
    }
  });

  if (!organization || !organization.reportSnapshots.length) {
    throw new Error("No hay métricas suficientes para generar un informe.");
  }

  const context = buildReportContext(organization.reportSnapshots);
  const prompt = DAILY_REPORT_PROMPT.replace("{{REPORT_CONTEXT_JSON}}", JSON.stringify(context, null, 2));
  const summaryText = await generateText({ prompt, model: env.OPENAI_MODEL_SUMMARY });
  const headline = "Tu publicidad de ayer estuvo bajo control";

  const report = await prisma.dailyReport.upsert({
    where: {
      organizationId_reportDate_channel: {
        organizationId,
        reportDate: new Date(new Date().toISOString().slice(0, 10)),
        channel: "WHATSAPP"
      }
    },
    update: {
      status: ReportStatus.GENERATED,
      headline,
      summaryText,
      structuredPayload: context,
      llmPromptVersion: "v1",
      generationModel: env.OPENAI_MODEL_SUMMARY,
      generatedAt: new Date(),
      format: organization.reportPreference?.reportFormat ?? ReportFormat.STANDARD,
      locale: organization.locale
    },
    create: {
      organizationId,
      adAccountId: organization.adAccounts[0]?.id,
      reportDate: new Date(new Date().toISOString().slice(0, 10)),
      channel: "WHATSAPP",
      format: organization.reportPreference?.reportFormat ?? ReportFormat.STANDARD,
      locale: organization.locale,
      status: ReportStatus.GENERATED,
      headline,
      summaryText,
      structuredPayload: context,
      llmPromptVersion: "v1",
      generationModel: env.OPENAI_MODEL_SUMMARY,
      generatedAt: new Date()
    }
  });

  await logAuditEvent({
    organizationId,
    eventType: "REPORT_GENERATED",
    message: "Informe diario generado"
  });

  return report;
}

export async function sendDailyReport(organizationId: string) {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: {
      whatsappContact: true,
      dailyReports: { orderBy: { createdAt: "desc" }, take: 1 }
    }
  });

  const report = organization?.dailyReports[0];
  if (!organization?.whatsappContact || !report) {
    throw new Error("Falta reporte o contacto de WhatsApp.");
  }

  const body = `${report.headline}\n\n${report.summaryText}\n\nCosto estimado: ${formatMoney(
    Number((report.structuredPayload as { campaigns?: Array<{ cost?: number }> })?.campaigns?.[0]?.cost ?? 0),
    organization.defaultCurrency,
    "es-AR"
  )}`;

  const delivery = await sendWhatsAppReport({
    organizationId,
    dailyReportId: report.id,
    to: organization.whatsappContact.phoneNumberE164,
    body
  });

  await prisma.dailyReport.update({
    where: { id: report.id },
    data: {
      status: "SENT",
      sentAt: new Date()
    }
  });

  await logAuditEvent({
    organizationId,
    eventType: "REPORT_SENT",
    message: "Informe diario enviado por WhatsApp"
  });

  return delivery;
}

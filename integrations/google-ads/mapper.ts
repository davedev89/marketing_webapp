import { GoogleAdsDailyMetric } from "@/integrations/google-ads/types";

export function toSnapshotInput(metric: GoogleAdsDailyMetric, organizationId: string, adAccountId?: string) {
  return {
    organizationId,
    adAccountId,
    snapshotDate: new Date(metric.date),
    campaignId: metric.campaignId,
    campaignName: metric.campaignName,
    impressions: BigInt(metric.impressions),
    clicks: BigInt(metric.clicks),
    ctr: metric.ctr,
    costMicros: BigInt(metric.costMicros),
    conversions: metric.conversions,
    costPerConversion: metric.costPerConversion,
    conversionRate: metric.conversionRate,
    currencyCode: metric.currencyCode,
    rawMetrics: metric
  };
}

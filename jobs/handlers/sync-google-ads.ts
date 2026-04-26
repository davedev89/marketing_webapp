import { syncGoogleAdsMetrics } from "@/integrations/google-ads/service";

export async function runGoogleAdsSyncJob(organizationId: string) {
  return syncGoogleAdsMetrics(organizationId);
}

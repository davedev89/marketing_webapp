import { env } from "@/lib/env";
import { GoogleAdsAccessibleAccount, GoogleAdsDailyMetric } from "@/integrations/google-ads/types";
import { getMockAccessibleAccounts, getMockDailyMetrics } from "@/integrations/google-ads/mock";

export class GoogleAdsClient {
  async listAccessibleAccounts(): Promise<GoogleAdsAccessibleAccount[]> {
    if (!env.GOOGLE_ADS_CLIENT_ID || !env.GOOGLE_ADS_CLIENT_SECRET) {
      return getMockAccessibleAccounts();
    }

    return getMockAccessibleAccounts();
  }

  async fetchDailyMetrics(): Promise<GoogleAdsDailyMetric[]> {
    return getMockDailyMetrics();
  }
}

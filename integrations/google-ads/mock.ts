import { GoogleAdsAccessibleAccount, GoogleAdsDailyMetric } from "@/integrations/google-ads/types";

export async function getMockAccessibleAccounts(): Promise<GoogleAdsAccessibleAccount[]> {
  return [
    { customerId: "123-456-7890", name: "Casa Nube Search", currencyCode: "ARS" },
    { customerId: "555-111-2222", name: "Casa Nube Remarketing", currencyCode: "ARS" }
  ];
}

export async function getMockDailyMetrics(): Promise<GoogleAdsDailyMetric[]> {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 1000 * 60 * 60 * 24);
  const format = (date: Date) => date.toISOString().slice(0, 10);

  return [
    {
      date: format(yesterday),
      campaignId: "cmp-001",
      campaignName: "Busqueda Marca",
      impressions: 4100,
      clicks: 310,
      ctr: 7.56,
      costMicros: 22000000,
      conversions: 22,
      costPerConversion: 1000,
      conversionRate: 7.1,
      currencyCode: "ARS"
    },
    {
      date: format(yesterday),
      campaignId: "cmp-002",
      campaignName: "Shopping Invierno",
      impressions: 5200,
      clicks: 250,
      ctr: 4.8,
      costMicros: 28000000,
      conversions: 14,
      costPerConversion: 2000,
      conversionRate: 5.6,
      currencyCode: "ARS"
    }
  ];
}

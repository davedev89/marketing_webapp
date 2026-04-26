export type GoogleAdsAccessibleAccount = {
  customerId: string;
  name: string;
  currencyCode: string;
};

export type GoogleAdsDailyMetric = {
  date: string;
  campaignId: string;
  campaignName: string;
  impressions: number;
  clicks: number;
  ctr: number;
  costMicros: number;
  conversions: number;
  costPerConversion: number;
  conversionRate: number;
  currencyCode: string;
};

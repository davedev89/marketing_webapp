import { NextResponse } from "next/server";

import { connectGoogleAds } from "@/integrations/google-ads/service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const organizationId = searchParams.get("organizationId");

  if (!organizationId) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/onboarding?googleAds=missing-org`);
  }

  await connectGoogleAds(organizationId);
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/onboarding?googleAds=connected`);
}

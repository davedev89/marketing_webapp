import { NextResponse } from "next/server";

import { listAccessibleAccounts } from "@/integrations/google-ads/service";

export async function GET() {
  const accounts = await listAccessibleAccounts();
  return NextResponse.json({ accounts });
}

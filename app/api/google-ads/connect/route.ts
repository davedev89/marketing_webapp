import { NextResponse } from "next/server";

import { getRequiredSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getRequiredSession();
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/google-ads/callback?organizationId=${session.user.organizationId}`);
}

import { NextResponse } from "next/server";

import { activateSubscriptionFromWebhook } from "@/modules/billing/service";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.organizationId || !body.planCode) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  await activateSubscriptionFromWebhook({
    organizationId: body.organizationId,
    planCode: body.planCode,
    stripeCustomerId: body.stripeCustomerId,
    stripeSubscriptionId: body.stripeSubscriptionId,
    stripePriceId: body.stripePriceId
  });

  return NextResponse.json({ ok: true });
}

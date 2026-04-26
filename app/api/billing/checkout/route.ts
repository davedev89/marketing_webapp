import { NextResponse } from "next/server";
import { z } from "zod";

import { getRequiredSession } from "@/lib/auth/session";
import { createCheckoutForOrganization } from "@/modules/billing/service";

const schema = z.object({
  planCode: z.enum(["STARTER", "GROWTH", "SCALE"])
});

export async function POST(request: Request) {
  const session = await getRequiredSession();
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success || !session.user.organizationId) {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const checkout = await createCheckoutForOrganization(session.user.organizationId, parsed.data.planCode);
  return NextResponse.json(checkout);
}

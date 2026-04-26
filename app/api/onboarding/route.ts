import { NextResponse } from "next/server";

import { getRequiredSession } from "@/lib/auth/session";
import { saveOnboardingStep } from "@/modules/onboarding/service";

export async function POST(request: Request) {
  const session = await getRequiredSession();
  const body = await request.json();

  if (body.organizationId !== session.user.organizationId) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  try {
    await saveOnboardingStep(body);
    return NextResponse.json({ ok: true, nextStep: Math.min((body.step ?? 1) + 1, 5) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo guardar el onboarding." }, { status: 400 });
  }
}

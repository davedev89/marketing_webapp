import { NextResponse } from "next/server";
import { z } from "zod";

import { checkRateLimit } from "@/lib/security/rate-limit";
import { registerUser } from "@/modules/users/service";

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const rate = checkRateLimit(`register:${parsed.data.email}`, 5, 60_000);
  if (!rate.ok) {
    return NextResponse.json({ error: "Demasiados intentos. Intenta nuevamente en un minuto." }, { status: 429 });
  }

  try {
    const user = await registerUser(parsed.data);
    return NextResponse.json({ ok: true, userId: user.id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No pudimos crear la cuenta." }, { status: 400 });
  }
}

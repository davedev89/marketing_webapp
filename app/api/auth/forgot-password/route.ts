import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db/prisma";
import { logAuditEvent } from "@/modules/audit/service";

const schema = z.object({
  email: z.string().email()
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Email inválido." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email }
  });

  if (user) {
    await logAuditEvent({
      userId: user.id,
      eventType: "ERROR",
      message: "Recuperación de contraseña solicitada"
    });
  }

  return NextResponse.json({ ok: true });
}

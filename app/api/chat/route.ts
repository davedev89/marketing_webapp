import { NextResponse } from "next/server";
import { z } from "zod";

import { getRequiredSession } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { answerChatQuestion } from "@/modules/chat/service";

const schema = z.object({
  message: z.string().min(3)
});

export async function POST(request: Request) {
  const session = await getRequiredSession();
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success || !session.user.organizationId) {
    return NextResponse.json({ error: "Mensaje inválido." }, { status: 400 });
  }

  const rate = checkRateLimit(`chat:${session.user.id}`, 20, 60_000);
  if (!rate.ok) {
    return NextResponse.json({ error: "Estás enviando demasiadas preguntas seguidas." }, { status: 429 });
  }

  const response = await answerChatQuestion({
    organizationId: session.user.organizationId,
    userId: session.user.id,
    message: parsed.data.message
  });

  return NextResponse.json(response);
}

import { ChatBox } from "@/components/dashboard/chat-box";
import { Card } from "@/components/ui/card";
import { getRequiredSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import type { ChatMessage } from "@prisma/client";

export default async function ChatPage() {
  const session = await getRequiredSession();

  const conversation = await prisma.chatConversation.findFirst({
    where: {
      userId: session.user.id
    },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        take: 10
      }
    }
  });

  return (
    <div className="space-y-6">
      <Card className="space-y-2">
        <h2 className="text-xl font-semibold">Haz una pregunta sobre tu rendimiento</h2>
        <p className="text-sm text-slate-600">El asistente responde usando tus métricas guardadas y tus informes previos. Si falta información, te lo dirá claramente.</p>
      </Card>
      <ChatBox
        initialMessages={
          conversation?.messages.map((message: ChatMessage) => ({
            role: message.role as "USER" | "ASSISTANT",
            content: message.content
          })) ?? []
        }
      />
    </div>
  );
}

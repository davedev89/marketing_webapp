import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { generateText } from "@/lib/ai/client";
import { CHAT_PROMPT } from "@/prompts/chat";
import { logAuditEvent } from "@/modules/audit/service";

export async function answerChatQuestion({
  organizationId,
  userId,
  message
}: {
  organizationId: string;
  userId: string;
  message: string;
}) {
  const [snapshots, reports] = await Promise.all([
    prisma.reportSnapshot.findMany({
      where: { organizationId },
      orderBy: { snapshotDate: "desc" },
      take: 7
    }),
    prisma.dailyReport.findMany({
      where: { organizationId },
      orderBy: { reportDate: "desc" },
      take: 3
    })
  ]);

  const context = {
    recentSnapshots: snapshots.map((snapshot: (typeof snapshots)[number]) => ({
      date: snapshot.snapshotDate,
      campaign: snapshot.campaignName,
      clicks: Number(snapshot.clicks ?? 0),
      conversions: Number(snapshot.conversions ?? 0),
      costPerConversion: Number(snapshot.costPerConversion ?? 0)
    })),
    recentReports: reports.map((report: (typeof reports)[number]) => ({
      date: report.reportDate,
      headline: report.headline,
      summaryText: report.summaryText
    }))
  };

  const prompt = CHAT_PROMPT.replace("{{CHAT_CONTEXT_JSON}}", JSON.stringify(context, null, 2)).replace("{{USER_QUESTION}}", message);
  const answer = await generateText({ prompt, model: env.OPENAI_MODEL_CHAT });

  const conversation =
    (await prisma.chatConversation.findFirst({
      where: { organizationId, userId }
    })) ??
    (await prisma.chatConversation.create({
      data: {
        organizationId,
        userId,
        title: "Consultas de rendimiento",
        lastMessageAt: new Date()
      }
    }));

  await prisma.chatMessage.createMany({
    data: [
      {
        conversationId: conversation.id,
        role: "USER",
        source: "WEB",
        content: message,
        groundedContext: context
      },
      {
        conversationId: conversation.id,
        role: "ASSISTANT",
        source: "WEB",
        content: answer,
        groundedContext: context,
        model: env.OPENAI_MODEL_CHAT,
        promptVersion: "v1"
      }
    ]
  });

  await prisma.chatConversation.update({
    where: { id: conversation.id },
    data: {
      lastMessageAt: new Date()
    }
  });

  await logAuditEvent({
    organizationId,
    userId,
    eventType: "CHAT_QUESTION",
    message: "Pregunta respondida en chat"
  });

  return { answer, context };
}

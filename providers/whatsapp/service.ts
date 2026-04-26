import { WhatsAppDeliveryStatus, WhatsAppProvider as WhatsAppProviderEnum } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { MetaWhatsAppProvider } from "@/providers/whatsapp/meta";
import { MockWhatsAppProvider } from "@/providers/whatsapp/mock";

const provider = env.WHATSAPP_PROVIDER === "meta" ? new MetaWhatsAppProvider() : new MockWhatsAppProvider();

export async function sendWhatsAppReport({
  organizationId,
  dailyReportId,
  to,
  body
}: {
  organizationId: string;
  dailyReportId?: string;
  to: string;
  body: string;
}) {
  const contact = await prisma.whatsAppContact.findUnique({
    where: { organizationId }
  });

  if (!contact) {
    throw new Error("No hay contacto de WhatsApp configurado.");
  }

  const result = await provider.sendMessage({ to, body });

  const delivery = await prisma.whatsAppMessageDelivery.create({
    data: {
      organizationId,
      whatsappContactId: contact.id,
      dailyReportId,
      provider: env.WHATSAPP_PROVIDER === "meta" ? WhatsAppProviderEnum.META_CLOUD : WhatsAppProviderEnum.MOCK,
      providerMessageId: result.providerMessageId,
      messageBody: body,
      deliveryStatus: result.status === "SENT" ? WhatsAppDeliveryStatus.SENT : WhatsAppDeliveryStatus.FAILED,
      attemptCount: 1,
      lastAttemptAt: new Date(),
      deliveredAt: result.status === "SENT" ? new Date() : null,
      failedAt: result.status === "FAILED" ? new Date() : null,
      errorMessage: result.errorMessage
    }
  });

  await prisma.whatsAppContact.update({
    where: { organizationId },
    data: {
      lastMessageSentAt: result.status === "SENT" ? new Date() : contact.lastMessageSentAt,
      lastErrorMessage: result.errorMessage
    }
  });

  return delivery;
}

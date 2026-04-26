import { SendMessageInput, SendMessageResult, WhatsAppProviderClient } from "@/providers/whatsapp/interface";
import { env } from "@/lib/env";

export class MetaWhatsAppProvider implements WhatsAppProviderClient {
  async sendMessage(input: SendMessageInput): Promise<SendMessageResult> {
    if (!env.WHATSAPP_META_TOKEN || !env.WHATSAPP_META_PHONE_NUMBER_ID) {
      return { providerMessageId: `meta-mock-${Date.now()}`, status: "SENT" };
    }

    const response = await fetch(
      `https://graph.facebook.com/${env.WHATSAPP_META_API_VERSION}/${env.WHATSAPP_META_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.WHATSAPP_META_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: input.to,
          type: "text",
          text: { body: input.body }
        })
      }
    );

    if (!response.ok) {
      const payload = await response.text();
      return { providerMessageId: `meta-error-${Date.now()}`, status: "FAILED", errorMessage: payload };
    }

    const payload = await response.json();
    return { providerMessageId: payload.messages?.[0]?.id ?? `meta-${Date.now()}`, status: "SENT" };
  }
}

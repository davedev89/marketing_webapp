import { SendMessageResult, WhatsAppProviderClient } from "@/providers/whatsapp/interface";

export class MockWhatsAppProvider implements WhatsAppProviderClient {
  async sendMessage(): Promise<SendMessageResult> {
    return {
      providerMessageId: `mock-${Date.now()}`,
      status: "SENT" as const
    };
  }
}

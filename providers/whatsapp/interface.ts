export type SendMessageInput = {
  to: string;
  body: string;
};

export type SendMessageResult = {
  providerMessageId: string;
  status: "SENT" | "FAILED";
  errorMessage?: string;
};

export interface WhatsAppProviderClient {
  sendMessage(input: SendMessageInput): Promise<SendMessageResult>;
}

"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Message = {
  role: "USER" | "ASSISTANT";
  content: string;
};

export function ChatBox({ initialMessages = [] }: { initialMessages?: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function sendMessage() {
    if (!prompt.trim()) return;

    const nextMessages = [...messages, { role: "USER" as const, content: prompt }];
    setMessages(nextMessages);
    setIsLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt })
    });

    const payload = await response.json();
    setIsLoading(false);
    setPrompt("");

    if (!response.ok) {
      setMessages([...nextMessages, { role: "ASSISTANT", content: payload.error ?? "No pude responder ahora." }]);
      return;
    }

    setMessages([...nextMessages, { role: "ASSISTANT", content: payload.answer }]);
  }

  return (
    <Card className="space-y-4">
      <div className="space-y-3">
        {messages.length === 0 ? <p className="text-sm text-slate-600">Haz una pregunta simple sobre tu rendimiento.</p> : null}
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`rounded-2xl px-4 py-3 text-sm ${message.role === "USER" ? "bg-slate-100" : "bg-ocean/10"}`}>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{message.role === "USER" ? "Tú" : "Asistente"}</p>
            <p className="text-slate-800">{message.content}</p>
          </div>
        ))}
      </div>
      <Textarea placeholder="Ej: ¿Cómo estuvo mi publicidad hoy?" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <Button onClick={sendMessage} disabled={isLoading}>
        {isLoading ? "Pensando..." : "Enviar pregunta"}
      </Button>
    </Card>
  );
}

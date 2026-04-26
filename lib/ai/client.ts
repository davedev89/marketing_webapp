import OpenAI from "openai";

import { env } from "@/lib/env";

export async function generateText({
  prompt,
  model
}: {
  prompt: string;
  model: string;
}) {
  if (env.AI_PROVIDER === "openai" && env.OPENAI_API_KEY) {
    const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    const completion = await client.responses.create({
      model,
      input: prompt
    });

    return completion.output_text.trim();
  }

  return "No había suficiente contexto para una respuesta más profunda. Con los datos actuales, te conviene revisar si hubo cambios en conversiones, costo por conversión y campañas principales.";
}

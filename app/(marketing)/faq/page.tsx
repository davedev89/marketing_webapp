import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-8 px-6 py-16">
      <SectionTitle
        eyebrow="FAQ"
        title="Preguntas frecuentes"
        description="Respuestas pensadas para quienes quieren entender su publicidad sin entrar en complejidades."
      />
      <div className="space-y-4">
        {[
          ["¿Qué recibo por WhatsApp?", "Un resumen diario simple, con cambios relevantes, alertas y campañas destacadas."],
          ["¿Puedo hacer preguntas?", "Sí. El chat usa métricas guardadas e informes previos para responder con contexto real."],
          ["¿Qué pasa si falla una conexión?", "El sistema marca el estado, registra el error y deja preparado el flujo de reconexión."],
          ["¿Está listo para crecer?", "Sí. La arquitectura deja preparada la incorporación de Meta Ads, GA4 y más fuentes."]
        ].map(([title, description]) => (
          <Card key={title}>
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-600">{description}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}

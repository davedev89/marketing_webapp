import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageSquareText, ShieldCheck, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";

const benefits = [
  "Explica qué está pasando con tu publicidad sin obligarte a abrir dashboards.",
  "Detecta subidas o caídas importantes y te las resume en lenguaje simple.",
  "Te da contexto para hablar mejor con tu agencia o equipo."
];

const flow = [
  "Te registras en pocos minutos.",
  "Conectas Google Ads con un click.",
  "Configuras tu WhatsApp y horario.",
  "Recibes un resumen diario claro y puedes hacer preguntas."
];

const pricing = [
  { name: "Starter", price: "USD 29", description: "1 cuenta publicitaria y reportes diarios." },
  { name: "Growth", price: "USD 59", description: "Más historial, chat y soporte prioritario." },
  { name: "Scale", price: "Consultar", description: "Pensado para negocios con más volumen." }
];

export default function MarketingPage() {
  return (
    <main>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-ocean shadow-soft">
            Resúmenes claros de Google Ads por WhatsApp
          </div>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950">
              Entiende si tu publicidad está funcionando sin perderte en métricas técnicas.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              mi_producto te explica cada mañana qué pasó con tus campañas, qué cambió frente a ayer y qué conviene revisar con tu agencia.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/register">
              <Button className="gap-2">
                Conectar Google Ads
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary">Ver demo</Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="bg-white/90">
              <TrendingUp className="mb-4 h-6 w-6 text-ocean" />
              <p className="text-sm text-slate-600">Te cuenta si el costo o las conversiones cambiaron de verdad.</p>
            </Card>
            <Card className="bg-white/90">
              <MessageSquareText className="mb-4 h-6 w-6 text-ocean" />
              <p className="text-sm text-slate-600">Puedes hacer preguntas y recibir respuestas simples basadas en tus datos.</p>
            </Card>
            <Card className="bg-white/90">
              <ShieldCheck className="mb-4 h-6 w-6 text-ocean" />
              <p className="text-sm text-slate-600">OAuth, pagos y manejo de integraciones listos para un SaaS real.</p>
            </Card>
          </div>
        </div>
        <Card className="space-y-4 bg-slate-950 text-white">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-300">Ejemplo de resumen</p>
          <div className="space-y-3 rounded-3xl bg-white/5 p-6">
            <p className="text-lg font-medium">Tu publicidad de ayer estuvo estable.</p>
            <p className="text-sm text-slate-300">
              Hubo menos conversiones que el día anterior, pero la campaña Búsqueda Marca siguió siendo la más fuerte. El costo por conversión subió un 18%.
            </p>
            <p className="text-sm text-slate-300">Quizás conviene revisar con tu agencia si cambió la inversión o la calidad del tráfico.</p>
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-6 py-14">
        <SectionTitle
          eyebrow="Cómo funciona"
          title="Un flujo simple para un usuario no técnico"
          description="El MVP está pensado para que el cliente se active solo y empiece a recibir valor sin soporte manual."
        />
        <div className="grid gap-4 md:grid-cols-4">
          {flow.map((item, index) => (
            <Card key={item}>
              <p className="mb-3 text-sm font-semibold text-ocean">Paso {index + 1}</p>
              <p className="text-sm text-slate-600">{item}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-6 py-14">
        <SectionTitle eyebrow="Beneficios" title="Pensado para dueños de negocio" />
        <div className="grid gap-4 md:grid-cols-3">
          {benefits.map((item) => (
            <Card key={item}>
              <CheckCircle2 className="mb-4 h-6 w-6 text-emerald-600" />
              <p className="text-sm leading-7 text-slate-600">{item}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-6 py-14">
        <SectionTitle eyebrow="Planes" title="Pricing placeholder listo para Stripe" />
        <div className="grid gap-4 md:grid-cols-3">
          {pricing.map((plan) => (
            <Card key={plan.name} className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{plan.price}</p>
              </div>
              <p className="text-sm text-slate-600">{plan.description}</p>
              <Link href="/register">
                <Button className="w-full">Empezar</Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl space-y-6 px-6 py-14">
        <SectionTitle eyebrow="FAQ" title="Lo importante para empezar" />
        <div className="space-y-4">
          {[
            ["¿Necesito saber usar Google Ads?", "No. El producto está pensado para personas no técnicas."],
            ["¿Tengo que pasar una API key?", "No. La conexión es por OAuth: haces click, autorizas y listo."],
            ["¿Puedo probarlo localmente?", "Sí. El proyecto incluye mocks para WhatsApp, IA y Google Ads."],
            ["¿Qué pasa si dejo de pagar?", "Se pausa la generación de nuevos informes, pero conservas el historial."]
          ].map(([question, answer]) => (
            <Card key={question}>
              <h3 className="text-base font-semibold text-slate-900">{question}</h3>
              <p className="mt-2 text-sm text-slate-600">{answer}</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

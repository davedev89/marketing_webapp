"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type OnboardingWizardProps = {
  organizationId: string;
  initialStep: number;
  defaults: {
    fullName?: string | null;
    businessName?: string | null;
    country?: string | null;
    timezone?: string | null;
    locale?: string | null;
    phoneNumber?: string | null;
    deliveryTime?: string | null;
    currency?: string | null;
  };
};

export function OnboardingWizard({ organizationId, initialStep, defaults }: OnboardingWizardProps) {
  const [step, setStep] = useState(Math.max(1, initialStep || 1));
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: defaults.fullName ?? "",
    businessName: defaults.businessName ?? "",
    country: defaults.country ?? "AR",
    timezone: defaults.timezone ?? "America/Argentina/Buenos_Aires",
    locale: defaults.locale ?? "es",
    phoneNumber: defaults.phoneNumber ?? "+549",
    planCode: "STARTER",
    deliveryTime: defaults.deliveryTime ?? "08:30",
    reportFormat: "STANDARD",
    currency: defaults.currency ?? "ARS"
  });

  async function save(payload: Record<string, unknown>) {
    setIsSaving(true);
    setMessage(null);
    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId, ...payload })
    });

    const data = await response.json();
    setIsSaving(false);

    if (!response.ok) {
      setMessage(data.error ?? "No pudimos guardar este paso.");
      return false;
    }

    setStep(data.nextStep);
    setMessage("Guardado.");
    return true;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((item) => (
          <span
            key={item}
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              step >= item ? "bg-ink text-white" : "bg-slate-100 text-slate-500"
            }`}
          >
            Paso {item}
          </span>
        ))}
      </div>

      {step === 1 ? (
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold">Datos básicos</h2>
          <Input placeholder="Nombre" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <Input
            placeholder="Nombre del negocio"
            value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
          />
          <Input placeholder="País" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          <Input placeholder="Zona horaria" value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} />
          <Input placeholder="Idioma" value={form.locale} onChange={(e) => setForm({ ...form, locale: e.target.value })} />
          <Button
            disabled={isSaving}
            onClick={() =>
              save({
                step: 2,
                basics: {
                  fullName: form.fullName,
                  businessName: form.businessName,
                  country: form.country,
                  timezone: form.timezone,
                  locale: form.locale
                }
              })
            }
          >
            Continuar
          </Button>
        </Card>
      ) : null}

      {step === 2 ? (
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold">WhatsApp</h2>
          <Input
            placeholder="+5491100000000"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          />
          <p className="text-sm text-slate-600">Usaremos este número para enviarte un resumen diario a la mañana.</p>
          <Button disabled={isSaving} onClick={() => save({ step: 3, whatsapp: { phoneNumber: form.phoneNumber, consentGiven: true } })}>
            Guardar y seguir
          </Button>
        </Card>
      ) : null}

      {step === 3 ? (
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold">Suscripción</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {["STARTER", "GROWTH", "SCALE"].map((plan) => (
              <button
                type="button"
                key={plan}
                className={`rounded-2xl border p-4 text-left ${form.planCode === plan ? "border-ink bg-slate-50" : "border-slate-200"}`}
                onClick={() => setForm({ ...form, planCode: plan })}
              >
                <p className="font-semibold">{plan}</p>
              </button>
            ))}
          </div>
          <Button disabled={isSaving} onClick={() => save({ step: 4, subscription: { planCode: form.planCode } })}>
            Seleccionar plan
          </Button>
        </Card>
      ) : null}

      {step === 4 ? (
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold">Conectar Google Ads</h2>
          <p className="text-sm text-slate-600">Para local, el flujo usa un conector mock y deja lista la estructura OAuth real.</p>
          <a href="/api/google-ads/connect" className="inline-flex">
            <Button>Conectar Google Ads</Button>
          </a>
          <Button variant="secondary" disabled={isSaving} onClick={() => save({ step: 5 })}>
            Ya lo conecté
          </Button>
        </Card>
      ) : null}

      {step === 5 ? (
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold">Preferencias del informe</h2>
          <Input
            placeholder="08:30"
            value={form.deliveryTime}
            onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
          />
          <Input
            placeholder="Moneda"
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
          />
          <Button
            disabled={isSaving}
            onClick={() =>
              save({
                step: 5,
                preferences: {
                  deliveryTime: form.deliveryTime,
                  reportFormat: form.reportFormat,
                  currency: form.currency,
                  priorityMetrics: ["conversions", "cost_per_conversion", "clicks"]
                }
              })
            }
          >
            Finalizar onboarding
          </Button>
        </Card>
      ) : null}

      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}

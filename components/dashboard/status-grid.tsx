import { StatusPill } from "@/components/ui/status-pill";
import { Card } from "@/components/ui/card";

type StatusGridProps = {
  subscriptionStatus?: string | null;
  googleAdsStatus?: string | null;
  whatsappStatus?: string | null;
  deliveryTime?: string | null;
  lastReport?: string | null;
};

export function StatusGrid({ subscriptionStatus, googleAdsStatus, whatsappStatus, deliveryTime, lastReport }: StatusGridProps) {
  const items = [
    { label: "Suscripción", value: subscriptionStatus ?? "Pendiente" },
    { label: "Google Ads", value: googleAdsStatus ?? "No conectado" },
    { label: "WhatsApp", value: whatsappStatus ?? "No configurado" },
    { label: "Hora programada", value: deliveryTime ?? "Sin definir" },
    { label: "Último informe", value: lastReport ?? "Todavía no se envió" }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <Card key={item.label} className="space-y-3">
          <p className="text-sm text-slate-500">{item.label}</p>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">{item.value}</p>
            <StatusPill
              label={item.value}
              tone={item.value.toLowerCase().includes("active") || item.value.toLowerCase().includes("sent") ? "success" : "neutral"}
            />
          </div>
        </Card>
      ))}
    </div>
  );
}

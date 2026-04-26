import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-10 px-6 py-16">
      <SectionTitle
        eyebrow="Planes"
        title="Un pricing simple para el MVP"
        description="Puedes ajustar los valores y conectarlos a Stripe desde variables de entorno."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Starter", "USD 29", "Para 1 cuenta publicitaria y uso individual."],
          ["Growth", "USD 59", "Para más historial, más volumen y mejor soporte."],
          ["Scale", "Custom", "Reservado para futura expansión multi-cuenta."]
        ].map(([name, price, description]) => (
          <Card key={name} className="space-y-4">
            <h3 className="text-xl font-semibold">{name}</h3>
            <p className="text-3xl font-semibold text-slate-950">{price}</p>
            <p className="text-sm text-slate-600">{description}</p>
            <Link href="/register">
              <Button className="w-full">Elegir plan</Button>
            </Link>
          </Card>
        ))}
      </div>
    </main>
  );
}

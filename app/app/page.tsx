import Link from "next/link";

import { Card } from "@/components/ui/card";
import { StatusGrid } from "@/components/dashboard/status-grid";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/format";
import { getRequiredSession } from "@/lib/auth/session";
import { getOrganizationForUser } from "@/modules/organizations/service";

export default async function DashboardPage() {
  const session = await getRequiredSession();
  const organization = await getOrganizationForUser(session.user.id);

  if (!organization) {
    return null;
  }

  const lastReport = organization.dailyReports[0];

  return (
    <div className="space-y-6">
      <StatusGrid
        subscriptionStatus={organization.subscription?.status}
        googleAdsStatus={organization.googleAdsConnection?.status}
        whatsappStatus={organization.whatsappContact?.verificationStatus}
        deliveryTime={organization.reportPreference?.deliveryTime}
        lastReport={lastReport ? formatDate(lastReport.reportDate) : null}
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold">Estado general</h2>
          <p className="text-sm leading-7 text-slate-600">
            {organization.subscription?.status === "ACTIVE"
              ? "Tu suscripción está activa."
              : "Todavía te falta completar o activar la suscripción."}{" "}
            {organization.googleAdsConnection?.status === "ACTIVE"
              ? "Google Ads ya está conectado."
              : "Aún no terminaste la conexión con Google Ads."}{" "}
            {organization.whatsappContact?.isVerified
              ? "WhatsApp está listo para recibir informes."
              : "Configura tu número de WhatsApp para cerrar el flujo."}
          </p>
          <div className="flex gap-3">
            <Link href="/onboarding">
              <Button>Completar onboarding</Button>
            </Link>
            <Link href="/app/reports">
              <Button variant="secondary">Ver historial</Button>
            </Link>
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-xl font-semibold">Alertas simples</h2>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>Si tu conexión de Google Ads vence, verás un aviso aquí para reconectar.</li>
            <li>Si se pausa la suscripción, se conserva tu historial pero se frenan nuevos envíos.</li>
            <li>Los jobs diarios quedan registrados para poder reintentar fallos.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

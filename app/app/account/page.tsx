import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRequiredSession } from "@/lib/auth/session";
import { getOrganizationForUser } from "@/modules/organizations/service";

export default async function AccountPage() {
  const session = await getRequiredSession();
  const organization = await getOrganizationForUser(session.user.id);
  const account = organization?.adAccounts[0];

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <h2 className="text-xl font-semibold">Cuenta publicitaria conectada</h2>
        <p className="text-sm text-slate-600">Customer ID: {organization?.googleAdsConnection?.selectedCustomerId ?? "Sin seleccionar"}</p>
        <p className="text-sm text-slate-600">Nombre: {account?.name ?? organization?.googleAdsConnection?.selectedAccountName ?? "Sin conectar"}</p>
        <div className="flex gap-3">
          <a href="/api/google-ads/connect">
            <Button>Reconectar</Button>
          </a>
          <Link href="/onboarding">
            <Button variant="secondary">Cambiar cuenta</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

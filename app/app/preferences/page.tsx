import { Card } from "@/components/ui/card";
import { getRequiredSession } from "@/lib/auth/session";
import { getOrganizationForUser } from "@/modules/organizations/service";

export default async function PreferencesPage() {
  const session = await getRequiredSession();
  const organization = await getOrganizationForUser(session.user.id);
  const preferences = organization?.reportPreference;

  return (
    <Card className="space-y-4">
      <h2 className="text-xl font-semibold">Preferencias</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm text-slate-500">Horario</p>
          <p className="font-medium text-slate-900">{preferences?.deliveryTime ?? "No definido"}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Idioma</p>
          <p className="font-medium text-slate-900">{preferences?.locale ?? organization?.locale ?? "es"}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Formato</p>
          <p className="font-medium text-slate-900">{preferences?.reportFormat ?? "STANDARD"}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Moneda</p>
          <p className="font-medium text-slate-900">{preferences?.currency ?? organization?.defaultCurrency ?? "USD"}</p>
        </div>
      </div>
    </Card>
  );
}

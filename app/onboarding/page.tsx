import { redirect } from "next/navigation";

import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { Card } from "@/components/ui/card";
import { getRequiredSession } from "@/lib/auth/session";
import { getOrganizationForUser } from "@/modules/organizations/service";

export default async function OnboardingPage() {
  const session = await getRequiredSession();
  const organization = await getOrganizationForUser(session.user.id);

  if (!organization) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Card className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Configura tu cuenta</h1>
        <p className="mt-2 text-sm text-slate-600">Te guiamos paso a paso para dejar listo el servicio y empezar a recibir resúmenes por WhatsApp.</p>
      </Card>
      <OnboardingWizard
        organizationId={organization.id}
        initialStep={organization.onboardingStep + 1}
        defaults={{
          fullName: session.user.name,
          businessName: organization.businessName,
          country: organization.country,
          timezone: organization.timezone,
          locale: organization.locale,
          phoneNumber: organization.whatsappContact?.phoneNumberE164,
          deliveryTime: organization.reportPreference?.deliveryTime,
          currency: organization.reportPreference?.currency ?? organization.defaultCurrency
        }}
      />
    </main>
  );
}

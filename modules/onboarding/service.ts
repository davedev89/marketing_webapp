import { ConnectionStatus, OrganizationStatus, PlanCode, ReportFormat, SubscriptionStatus, WhatsAppProvider } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { logAuditEvent } from "@/modules/audit/service";

type OnboardingPayload = {
  organizationId: string;
  step: number;
  basics?: {
    fullName: string;
    businessName: string;
    country: string;
    timezone: string;
    locale: string;
  };
  whatsapp?: {
    phoneNumber: string;
    consentGiven: boolean;
  };
  subscription?: {
    planCode: PlanCode;
  };
  preferences?: {
    deliveryTime: string;
    reportFormat: ReportFormat;
    currency: string;
    priorityMetrics: string[];
  };
};

export async function saveOnboardingStep(payload: OnboardingPayload) {
  const organization = await prisma.organization.findUnique({
    where: { id: payload.organizationId },
    include: {
      ownerUser: true
    }
  });

  if (!organization) {
    throw new Error("Organización no encontrada.");
  }

  if (payload.basics) {
    await prisma.organization.update({
      where: { id: payload.organizationId },
      data: {
        businessName: payload.basics.businessName,
        country: payload.basics.country,
        timezone: payload.basics.timezone,
        locale: payload.basics.locale,
        name: payload.basics.businessName
      }
    });

    if (organization.ownerUserId) {
      await prisma.user.update({
        where: { id: organization.ownerUserId },
        data: {
          fullName: payload.basics.fullName,
          timezone: payload.basics.timezone,
          locale: payload.basics.locale
        }
      });
    }
  }

  if (payload.whatsapp) {
    await prisma.whatsAppContact.upsert({
      where: { organizationId: payload.organizationId },
      update: {
        phoneNumberE164: payload.whatsapp.phoneNumber,
        phoneNumberRaw: payload.whatsapp.phoneNumber,
        consentGivenAt: payload.whatsapp.consentGiven ? new Date() : null,
        verificationStatus: payload.whatsapp.consentGiven ? ConnectionStatus.ACTIVE : ConnectionStatus.PENDING,
        isVerified: payload.whatsapp.consentGiven
      },
      create: {
        organizationId: payload.organizationId,
        provider: WhatsAppProvider.MOCK,
        phoneNumberE164: payload.whatsapp.phoneNumber,
        phoneNumberRaw: payload.whatsapp.phoneNumber,
        consentGivenAt: payload.whatsapp.consentGiven ? new Date() : null,
        verificationStatus: payload.whatsapp.consentGiven ? ConnectionStatus.ACTIVE : ConnectionStatus.PENDING,
        isVerified: payload.whatsapp.consentGiven
      }
    });
  }

  if (payload.subscription) {
    await prisma.subscription.upsert({
      where: { organizationId: payload.organizationId },
      update: {
        planCode: payload.subscription.planCode
      },
      create: {
        organizationId: payload.organizationId,
        planCode: payload.subscription.planCode,
        status: SubscriptionStatus.INCOMPLETE
      }
    });
  }

  if (payload.preferences) {
    await prisma.reportPreference.upsert({
      where: { organizationId: payload.organizationId },
      update: payload.preferences,
      create: {
        organizationId: payload.organizationId,
        timezone: organization.timezone,
        locale: organization.locale,
        ...payload.preferences
      }
    });
  }

  const updated = await prisma.organization.update({
    where: { id: payload.organizationId },
    data: {
      onboardingStep: Math.max(payload.step, organization.onboardingStep),
      status: payload.step >= 5 ? OrganizationStatus.ACTIVE : OrganizationStatus.INCOMPLETE
    }
  });

  if (payload.step >= 5 && organization.ownerUserId) {
    await prisma.user.update({
      where: { id: organization.ownerUserId },
      data: { onboardingCompletedAt: new Date() }
    });

    await logAuditEvent({
      organizationId: organization.id,
      userId: organization.ownerUserId,
      eventType: "ONBOARDING_COMPLETED",
      message: "Onboarding completado"
    });
  }

  return updated;
}

export async function getOnboardingState(organizationId: string) {
  return prisma.organization.findUnique({
    where: { id: organizationId },
    include: {
      subscription: true,
      googleAdsConnection: true,
      whatsappContact: true,
      reportPreference: true
    }
  });
}

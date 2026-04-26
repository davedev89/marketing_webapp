import {
  ConnectionStatus,
  PlanCode,
  PrismaClient,
  ReportFormat,
  SubscriptionStatus,
  UserRole,
  UserStatus,
  WhatsAppProvider
} from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("demo1234", 10);

  const user = await prisma.user.upsert({
    where: { email: "owner@demo.com" },
    update: {},
    create: {
      email: "owner@demo.com",
      passwordHash,
      fullName: "Sofia Torres",
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: new Date()
    }
  });

  const organization = await prisma.organization.upsert({
    where: { id: "demo-org" },
    update: {},
    create: {
      id: "demo-org",
      name: "Casa Nube",
      businessName: "Casa Nube Home Decor",
      country: "AR",
      locale: "es",
      timezone: "America/Argentina/Buenos_Aires",
      defaultCurrency: "ARS",
      status: "ACTIVE",
      onboardingStep: 5,
      ownerUserId: user.id
    }
  });

  await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: user.id
      }
    },
    update: {},
    create: {
      organizationId: organization.id,
      userId: user.id
    }
  });

  await prisma.subscription.upsert({
    where: { organizationId: organization.id },
    update: {},
    create: {
      organizationId: organization.id,
      planCode: PlanCode.STARTER,
      status: SubscriptionStatus.ACTIVE,
      activatedAt: new Date(),
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    }
  });

  await prisma.whatsAppContact.upsert({
    where: { organizationId: organization.id },
    update: {},
    create: {
      organizationId: organization.id,
      provider: WhatsAppProvider.MOCK,
      phoneNumberE164: "+5491100000000",
      phoneNumberRaw: "11 0000 0000",
      consentGivenAt: new Date(),
      verificationStatus: ConnectionStatus.ACTIVE,
      isVerified: true
    }
  });

  await prisma.reportPreference.upsert({
    where: { organizationId: organization.id },
    update: {},
    create: {
      organizationId: organization.id,
      deliveryTime: "08:30",
      timezone: "America/Argentina/Buenos_Aires",
      locale: "es",
      reportFormat: ReportFormat.STANDARD,
      currency: "ARS",
      priorityMetrics: ["conversions", "cost_per_conversion", "clicks"]
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

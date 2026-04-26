import { MembershipRole, OrganizationStatus } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

export async function createDefaultOrganizationForUser(userId: string, ownerName: string) {
  const existingMembership = await prisma.organizationMember.findFirst({
    where: { userId },
    include: {
      organization: true
    }
  });

  if (existingMembership) {
    return existingMembership.organization;
  }

  const organization = await prisma.organization.create({
    data: {
      name: ownerName || "Mi negocio",
      businessName: ownerName || "Mi negocio",
      status: OrganizationStatus.INCOMPLETE,
      ownerUserId: userId,
      members: {
        create: {
          userId,
          role: MembershipRole.OWNER
        }
      }
    }
  });

  return organization;
}

export async function getOrganizationForUser(userId: string) {
  const membership = await prisma.organizationMember.findFirst({
    where: { userId },
    include: {
      organization: {
        include: {
          subscription: true,
          googleAdsConnection: true,
          whatsappContact: true,
          reportPreference: true,
          adAccounts: {
            where: { isPrimary: true },
            take: 1
          },
          dailyReports: {
            orderBy: { reportDate: "desc" },
            take: 5
          }
        }
      }
    }
  });

  return membership?.organization ?? null;
}

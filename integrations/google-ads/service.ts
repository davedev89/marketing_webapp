import { ConnectionStatus, ConnectedAccountProvider, GoogleAdsSyncStatus } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { encrypt } from "@/lib/security/crypto";
import { GoogleAdsClient } from "@/integrations/google-ads/client";
import { toSnapshotInput } from "@/integrations/google-ads/mapper";
import { logAuditEvent } from "@/modules/audit/service";

const client = new GoogleAdsClient();

export async function connectGoogleAds(organizationId: string) {
  const accounts = await client.listAccessibleAccounts();
  const primary = accounts[0];

  await prisma.connectedAccount.upsert({
    where: {
      organizationId_provider: {
        organizationId,
        provider: ConnectedAccountProvider.GOOGLE_ADS
      }
    },
    update: {
      status: ConnectionStatus.ACTIVE,
      externalAccountId: primary.customerId,
      externalAccountName: primary.name
    },
    create: {
      organizationId,
      provider: ConnectedAccountProvider.GOOGLE_ADS,
      status: ConnectionStatus.ACTIVE,
      externalAccountId: primary.customerId,
      externalAccountName: primary.name
    }
  });

  await prisma.googleAdsConnection.upsert({
    where: { organizationId },
    update: {
      status: ConnectionStatus.ACTIVE,
      selectedCustomerId: primary.customerId,
      selectedAccountName: primary.name,
      googleUserEmail: "mock-user@example.com",
      accessTokenEncrypted: encrypt("mock-access-token"),
      refreshTokenEncrypted: encrypt("mock-refresh-token"),
      tokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60),
      syncStatus: GoogleAdsSyncStatus.IDLE
    },
    create: {
      organizationId,
      status: ConnectionStatus.ACTIVE,
      selectedCustomerId: primary.customerId,
      selectedAccountName: primary.name,
      googleUserEmail: "mock-user@example.com",
      accessTokenEncrypted: encrypt("mock-access-token"),
      refreshTokenEncrypted: encrypt("mock-refresh-token"),
      tokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60),
      syncStatus: GoogleAdsSyncStatus.IDLE
    }
  });

  await prisma.adAccount.upsert({
    where: {
      organizationId_provider_externalAccountId: {
        organizationId,
        provider: ConnectedAccountProvider.GOOGLE_ADS,
        externalAccountId: primary.customerId
      }
    },
    update: {
      isPrimary: true,
      isActive: true,
      name: primary.name,
      currencyCode: primary.currencyCode,
      lastSeenAt: new Date()
    },
    create: {
      organizationId,
      provider: ConnectedAccountProvider.GOOGLE_ADS,
      externalAccountId: primary.customerId,
      name: primary.name,
      currencyCode: primary.currencyCode,
      isPrimary: true,
      isActive: true,
      lastSeenAt: new Date()
    }
  });

  await logAuditEvent({
    organizationId,
    eventType: "GOOGLE_ADS_CONNECTED",
    message: "Google Ads conectado en modo mock"
  });

  return accounts;
}

export async function listAccessibleAccounts() {
  return client.listAccessibleAccounts();
}

export async function syncGoogleAdsMetrics(organizationId: string) {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: {
      adAccounts: {
        where: { isPrimary: true },
        take: 1
      }
    }
  });

  if (!organization) {
    throw new Error("Organización no encontrada.");
  }

  const metrics = await client.fetchDailyMetrics();
  const adAccountId = organization.adAccounts[0]?.id;

  await prisma.googleAdsConnection.updateMany({
    where: { organizationId },
    data: {
      syncStatus: GoogleAdsSyncStatus.SYNCING
    }
  });

  for (const metric of metrics) {
    await prisma.reportSnapshot.upsert({
      where: {
        organizationId_snapshotDate_campaignId: {
          organizationId,
          snapshotDate: new Date(metric.date),
          campaignId: metric.campaignId
        }
      },
      update: toSnapshotInput(metric, organizationId, adAccountId),
      create: toSnapshotInput(metric, organizationId, adAccountId)
    });
  }

  await prisma.googleAdsConnection.updateMany({
    where: { organizationId },
    data: {
      syncStatus: GoogleAdsSyncStatus.SUCCESS,
      lastSyncedAt: new Date()
    }
  });

  await logAuditEvent({
    organizationId,
    eventType: "GOOGLE_ADS_SYNCED",
    message: "Sync de Google Ads completado"
  });

  return metrics.length;
}

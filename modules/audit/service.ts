import { AuditEventType, Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

type LogAuditEventInput = {
  organizationId?: string;
  userId?: string;
  eventType: keyof typeof AuditEventType;
  entityType?: string;
  entityId?: string;
  message?: string;
  metadata?: Record<string, unknown>;
};

export async function logAuditEvent(input: LogAuditEventInput) {
  return prisma.auditLog.create({
    data: {
      organizationId: input.organizationId,
      userId: input.userId,
      eventType: input.eventType,
      entityType: input.entityType,
      entityId: input.entityId,
      message: input.message,
      metadata: input.metadata as Prisma.InputJsonValue | undefined
    }
  });
}

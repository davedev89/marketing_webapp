import { UserStatus } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/passwords";
import { createDefaultOrganizationForUser } from "@/modules/organizations/service";
import { logAuditEvent } from "@/modules/audit/service";

type RegisterUserInput = {
  email: string;
  password: string;
  fullName: string;
};

export async function registerUser(input: RegisterUserInput) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email }
  });

  if (existing) {
    throw new Error("Ese email ya está registrado.");
  }

  const user = await prisma.user.create({
    data: {
      email: input.email,
      fullName: input.fullName,
      passwordHash: await hashPassword(input.password),
      status: UserStatus.ACTIVE
    }
  });

  await createDefaultOrganizationForUser(user.id, input.fullName);
  await logAuditEvent({
    userId: user.id,
    eventType: "AUTH_REGISTER",
    message: "Registro con email y password"
  });

  return user;
}

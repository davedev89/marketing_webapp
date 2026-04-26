import { PlanCode, SubscriptionStatus } from "@prisma/client";
import Stripe from "stripe";

import { env } from "@/lib/env";
import { prisma } from "@/lib/db/prisma";
import { logAuditEvent } from "@/modules/audit/service";

const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" }) : null;

const priceMap: Record<PlanCode, string | undefined> = {
  STARTER: env.STRIPE_PRICE_STARTER_MONTHLY,
  GROWTH: env.STRIPE_PRICE_GROWTH_MONTHLY,
  SCALE: env.STRIPE_PRICE_SCALE_MONTHLY
};

export async function createCheckoutForOrganization(organizationId: string, planCode: PlanCode) {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: { subscription: true, members: { include: { user: true }, take: 1 } }
  });

  if (!organization) {
    throw new Error("Organización no encontrada.");
  }

  if (!stripe || !priceMap[planCode]) {
    await prisma.subscription.upsert({
      where: { organizationId },
      update: {
        planCode,
        status: SubscriptionStatus.ACTIVE,
        activatedAt: new Date()
      },
      create: {
        organizationId,
        planCode,
        status: SubscriptionStatus.ACTIVE,
        activatedAt: new Date()
      }
    });

    return { url: `${env.NEXT_PUBLIC_APP_URL}/onboarding?billing=mock-success` };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: organization.members[0]?.user.email,
    line_items: [{ price: priceMap[planCode], quantity: 1 }],
    success_url: `${env.NEXT_PUBLIC_APP_URL}/onboarding?billing=success`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/onboarding?billing=cancelled`,
    metadata: { organizationId, planCode }
  });

  await prisma.subscription.upsert({
    where: { organizationId },
    update: { planCode, status: SubscriptionStatus.INCOMPLETE },
    create: { organizationId, planCode, status: SubscriptionStatus.INCOMPLETE }
  });

  return { url: session.url };
}

export async function activateSubscriptionFromWebhook(input: {
  organizationId: string;
  planCode: PlanCode;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
}) {
  const subscription = await prisma.subscription.upsert({
    where: { organizationId: input.organizationId },
    update: {
      planCode: input.planCode,
      status: SubscriptionStatus.ACTIVE,
      stripeCustomerId: input.stripeCustomerId,
      stripeSubscriptionId: input.stripeSubscriptionId,
      stripePriceId: input.stripePriceId,
      activatedAt: new Date()
    },
    create: {
      organizationId: input.organizationId,
      planCode: input.planCode,
      status: SubscriptionStatus.ACTIVE,
      stripeCustomerId: input.stripeCustomerId,
      stripeSubscriptionId: input.stripeSubscriptionId,
      stripePriceId: input.stripePriceId,
      activatedAt: new Date()
    }
  });

  await logAuditEvent({
    organizationId: input.organizationId,
    eventType: "SUBSCRIPTION_UPDATED",
    message: "Suscripción activada"
  });

  return subscription;
}

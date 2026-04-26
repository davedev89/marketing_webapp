import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { verifyPassword } from "@/lib/auth/passwords";
import { createDefaultOrganizationForUser } from "@/modules/organizations/service";
import { logAuditEvent } from "@/modules/audit/service";

export const authConfig = {
  trustHost: true,
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  providers: [
    Credentials({
      name: "Email y password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user?.passwordHash) {
          return null;
        }

        const isValid = await verifyPassword(credentials.password as string, user.passwordHash);
        if (!isValid) {
          return null;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() }
        });

        return {
          id: user.id,
          email: user.email,
          name: user.fullName
        };
      }
    }),
    Google({
      clientId: env.GOOGLE_CLIENT_ID ?? "google-client-id",
      clientSecret: env.GOOGLE_CLIENT_SECRET ?? "google-client-secret",
      allowDangerousEmailAccountLinking: true
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) {
        return false;
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email }
      });

      const dbUser =
        existingUser ??
        (await prisma.user.create({
          data: {
            email: user.email,
            fullName: user.name ?? profile?.name ?? "",
            emailVerified: new Date(),
            locale: "es",
            timezone: "America/Argentina/Buenos_Aires"
          }
        }));

      await createDefaultOrganizationForUser(dbUser.id, dbUser.fullName ?? user.name ?? "Mi negocio");

      if (account) {
        await prisma.authAccount.upsert({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId
            }
          },
          update: {
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            expiresAt: account.expires_at,
            tokenType: account.token_type,
            scope: account.scope,
            idToken: account.id_token
          },
          create: {
            userId: dbUser.id,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            expiresAt: account.expires_at,
            tokenType: account.token_type,
            scope: account.scope,
            idToken: account.id_token
          }
        });
      }

      await logAuditEvent({
        userId: dbUser.id,
        eventType: "AUTH_LOGIN",
        message: `Inicio de sesión con ${account?.provider ?? "credentials"}`
      });

      return true;
    },
    async jwt({ token }) {
      if (!token.email) {
        return token;
      }

      const user = await prisma.user.findUnique({
        where: { email: token.email },
        include: {
          memberships: {
            include: {
              organization: true
            }
          }
        }
      });

      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.organizationId = user.memberships[0]?.organizationId;
        token.onboardingCompletedAt = user.onboardingCompletedAt?.toISOString() ?? null;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.organizationId = token.organizationId as string | undefined;
        session.user.onboardingCompletedAt = token.onboardingCompletedAt as string | null;
      }
      return session;
    }
  }
} satisfies NextAuthConfig;

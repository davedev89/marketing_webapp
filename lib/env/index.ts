import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
  NEXTAUTH_URL: z.string().default("http://localhost:3000"),
  NEXTAUTH_SECRET: z.string().default("dev-secret"),
  APP_ENCRYPTION_KEY: z.string().default("replace-with-32-characters-minimum"),
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@localhost:5432/mi_producto"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  EMAIL_FROM: z.string().default("noreply@example.com"),
  RESEND_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_PRICE_STARTER_MONTHLY: z.string().optional(),
  STRIPE_PRICE_GROWTH_MONTHLY: z.string().optional(),
  STRIPE_PRICE_SCALE_MONTHLY: z.string().optional(),
  GOOGLE_ADS_CLIENT_ID: z.string().optional(),
  GOOGLE_ADS_CLIENT_SECRET: z.string().optional(),
  GOOGLE_ADS_DEVELOPER_TOKEN: z.string().optional(),
  GOOGLE_ADS_LOGIN_CUSTOMER_ID: z.string().optional(),
  GOOGLE_ADS_REDIRECT_URI: z.string().default("http://localhost:3000/api/google-ads/callback"),
  WHATSAPP_PROVIDER: z.enum(["mock", "meta"]).default("mock"),
  WHATSAPP_META_TOKEN: z.string().optional(),
  WHATSAPP_META_PHONE_NUMBER_ID: z.string().optional(),
  WHATSAPP_META_BUSINESS_ACCOUNT_ID: z.string().optional(),
  WHATSAPP_META_API_VERSION: z.string().default("v21.0"),
  AI_PROVIDER: z.enum(["openai", "mock"]).default("mock"),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL_SUMMARY: z.string().default("gpt-4o-mini"),
  OPENAI_MODEL_CHAT: z.string().default("gpt-4o-mini"),
  CRON_SECRET: z.string().default("dev-cron-secret"),
  JOB_BATCH_SIZE: z.coerce.number().default(50),
  JOB_RETRY_LIMIT: z.coerce.number().default(3),
  INTERNAL_ADMIN_EMAILS: z.string().default("")
});

export const env = envSchema.parse(process.env);

export const adminEmails = env.INTERNAL_ADMIN_EMAILS.split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

# mi_producto

MVP funcional de un SaaS para dueños de negocio que quieren entender su rendimiento en Google Ads sin entrar en dashboards técnicos. El producto centraliza onboarding, suscripción, conexión con Google Ads, configuración de WhatsApp, reportes diarios y chat basado en datos reales.

## Stack

- Next.js 15 + TypeScript + App Router
- PostgreSQL + Prisma
- Auth.js con credenciales y Google
- Stripe para suscripciones
- Google Ads con capa desacoplada y modo mock
- WhatsApp con interfaz de proveedor y mock por defecto
- IA configurable con OpenAI o modo mock

## Qué incluye esta base

- Landing pública con pricing placeholder y FAQ
- Login, registro y recuperación de contraseña base
- Onboarding guiado en 5 pasos
- Dashboard simple para cliente no técnico
- Capa de integración para Google Ads
- Capa abstracta para WhatsApp
- Jobs para sync, generación y envío de reportes
- Chat persistido con contexto desde snapshots e informes
- Admin técnico mínimo
- Prisma schema completo para el MVP

## Variables de entorno

Usa el archivo `.env.example` como base. Las principales son:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_APP_URL`
- `APP_ENCRYPTION_KEY`
- `STRIPE_*`
- `GOOGLE_*`
- `WHATSAPP_*`
- `OPENAI_*`
- `CRON_SECRET`

## Cómo correrlo

1. Copia `.env.example` a `.env`.
2. Ajusta `DATABASE_URL` a tu PostgreSQL local o remoto.
3. Instala dependencias:

```bash
npm install
```

4. Genera el cliente Prisma:

```bash
npx prisma generate
```

5. Corre migraciones o crea la base:

```bash
npx prisma migrate dev
```

6. Carga datos de ejemplo:

```bash
npm run prisma:seed
```

7. Levanta la app:

```bash
npm run dev
```

## Usuario demo

- Email: `owner@demo.com`
- Password: `demo1234`

## Flujos principales

### Registro e inicio de sesión

- `POST /api/auth/register` crea usuario, organización y membership owner.
- `Auth.js` maneja login con credenciales y Google.

### Onboarding

- `POST /api/onboarding` guarda cada paso.
- Paso 1: datos básicos.
- Paso 2: WhatsApp.
- Paso 3: plan/suscripción.
- Paso 4: conexión Google Ads.
- Paso 5: preferencias del informe.

### Billing

- `POST /api/billing/checkout` crea checkout.
- `POST /api/billing/webhook` activa la suscripción.
- Si faltan credenciales de Stripe, el sistema activa un flujo mock para desarrollo.

### Google Ads

- `GET /api/google-ads/connect` inicia el flujo.
- `GET /api/google-ads/callback` persiste conexión mock/real.
- `POST /api/google-ads/sync` sincroniza snapshots diarios.

### Reportes

- `POST /api/reports/generate` genera el informe diario.
- `POST /api/reports/send` envía el último informe por WhatsApp.

### Chat

- `POST /api/chat` guarda conversación y responde usando snapshots e informes.

### Jobs

- `POST /api/jobs/run` ejecuta jobs pendientes con `x-cron-secret`.

## Qué queda mockeado

- Google Ads API real: el contrato está listo y el modo local usa datos mock.
- WhatsApp Cloud API: hay provider real y mock; local usa mock por defecto.
- IA: si falta `OPENAI_API_KEY`, responde con fallback simple.
- Recuperación de contraseña: el endpoint existe, pero el envío real de email queda para la siguiente iteración.

## Verificación realizada

- `npx tsc --noEmit` pasa correctamente.
- `npx prisma generate` funciona con el schema actual.
- `next build` quedó bloqueado por un problema del entorno Windows con el binario SWC nativo; el código quedó validado estáticamente, pero no pude confirmar un build de producción completo en esta sesión.

## Roadmap hacia producción seria

- Completar OAuth real de Google Ads con refresh automático y manejo fino de errores.
- Persistir tokens externos con KMS o secret manager real.
- Completar Stripe portal, cancelación y reactivación.
- Validar y verificar WhatsApp con flujo real.
- Mejorar recuperación de contraseña con proveedor de email.
- Agregar tests de integración para onboarding, billing y jobs.
- Añadir observabilidad real, colas dedicadas y métricas operativas.
- Incorporar multi-cuenta publicitaria por organización.
- Incorporar Meta Ads, GA4 y más fuentes.

import Link from "next/link";

import { Card } from "@/components/ui/card";

export default function ResetPasswordPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-4xl items-center px-6 py-16">
      <Card className="mx-auto max-w-lg space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Reset pendiente</h1>
        <p className="text-sm text-slate-600">
          El flujo de recuperación quedó preparado a nivel de arquitectura. Para el entorno local, este MVP responde con confirmación y se puede completar conectando tu proveedor de email.
        </p>
        <Link href="/login" className="text-sm font-medium text-ocean">
          Volver al login
        </Link>
      </Card>
    </main>
  );
}

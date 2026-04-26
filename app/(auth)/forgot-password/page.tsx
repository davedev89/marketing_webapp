import Link from "next/link";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Card } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-4xl items-center px-6 py-16">
      <Card className="mx-auto w-full max-w-md">
        <div className="mb-6 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Recuperar contraseña</h1>
          <p className="text-sm text-slate-600">Te enviaremos un enlace de recuperación si el email existe en la plataforma.</p>
        </div>
        <ForgotPasswordForm />
        <p className="mt-4 text-sm text-slate-600">
          <Link href="/login" className="font-medium text-ocean">
            Volver al login
          </Link>
        </p>
      </Card>
    </main>
  );
}

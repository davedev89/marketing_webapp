import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl items-center px-6 py-16">
      <div className="grid w-full gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ocean">Ingresar</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Volvé a ver cómo estuvo tu publicidad.</h1>
          <p className="text-slate-600">Si ya tienes cuenta, entra y sigue el onboarding o revisa tus informes.</p>
        </div>
        <Card className="max-w-md">
          <LoginForm />
          <p className="mt-4 text-sm text-slate-600">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="font-medium text-ocean">
              Crear cuenta
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}

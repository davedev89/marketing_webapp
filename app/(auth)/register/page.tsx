import Link from "next/link";

import { RegisterForm } from "@/components/auth/register-form";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl items-center px-6 py-16">
      <div className="grid w-full gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ocean">Crear cuenta</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Empieza a recibir explicaciones claras sobre tu publicidad.</h1>
          <p className="text-slate-600">Primero creamos tu espacio, luego te guiamos paso a paso para conectar Google Ads, WhatsApp y tu plan.</p>
        </div>
        <Card className="max-w-md">
          <RegisterForm />
          <p className="mt-4 text-sm text-slate-600">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-medium text-ocean">
              Ingresar
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}

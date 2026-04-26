"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password })
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error ?? "No pudimos crear tu cuenta.");
      setIsLoading(false);
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    router.push("/onboarding");
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Nombre</label>
        <Input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Sofía Torres" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Email</label>
        <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tu@negocio.com" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Contraseña</label>
        <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Al menos 8 caracteres" />
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      <Button className="w-full" disabled={isLoading}>
        {isLoading ? "Creando cuenta..." : "Crear cuenta"}
      </Button>
      <Button type="button" variant="secondary" className="w-full" onClick={() => signIn("google", { callbackUrl: "/onboarding" })}>
        Registrarme con Google
      </Button>
    </form>
  );
}

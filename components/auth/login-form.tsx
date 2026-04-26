"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    setIsLoading(false);

    if (result?.error) {
      setError("No pudimos iniciar sesión. Revisa tus datos.");
      return;
    }

    router.push("/app");
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Email</label>
        <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tu@negocio.com" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Contraseña</label>
        <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      <Button className="w-full" disabled={isLoading}>
        {isLoading ? "Ingresando..." : "Ingresar"}
      </Button>
      <Button type="button" variant="secondary" className="w-full" onClick={() => signIn("google", { callbackUrl: "/app" })}>
        Continuar con Google
      </Button>
    </form>
  );
}

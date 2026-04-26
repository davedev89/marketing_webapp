import Link from "next/link";

import { LogoutButton } from "@/components/dashboard/logout-button";
import { getRequiredSession } from "@/lib/auth/session";

const links = [
  { href: "/app", label: "Resumen" },
  { href: "/app/account", label: "Cuenta publicitaria" },
  { href: "/app/preferences", label: "Preferencias" },
  { href: "/app/reports", label: "Historial" },
  { href: "/app/chat", label: "Chat" }
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getRequiredSession();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Hola, {session.user.name ?? "equipo"}</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Tu centro de control simple</h1>
        </div>
        <LogoutButton />
      </div>
      <div className="mb-8 flex flex-wrap gap-3">
        {links.map((link) => (
          <Link key={link.href} href={link.href as never} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700">
            {link.label}
          </Link>
        ))}
      </div>
      {children}
    </main>
  );
}

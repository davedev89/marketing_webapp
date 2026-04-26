import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { adminEmails } from "@/lib/env";

export async function getRequiredSession() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return session;
}

export async function getRequiredAdminSession() {
  const session = await getRequiredSession();
  const isAdmin = session.user.role === "ADMIN" || adminEmails.includes(session.user.email?.toLowerCase() ?? "");

  if (!isAdmin) {
    redirect("/app");
  }

  return session;
}

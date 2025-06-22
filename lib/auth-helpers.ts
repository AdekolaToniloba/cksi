// lib/auth-helpers.ts
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function requireAdminAuth() {
  const session = await getSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return session;
}

export async function getAuthUser() {
  const session = await getSession();
  return session?.user || null;
}

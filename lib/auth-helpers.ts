// lib/auth-helpers.ts
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

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

/**
 * API-route-safe admin auth guard.
 * Returns a 401 NextResponse if unauthenticated/unauthorized.
 * Returns null if the user IS an admin (caller should proceed normally).
 *
 * Usage in API route:
 *   const authError = await requireAdminAuthAPI();
 *   if (authError) return authError;
 */
export async function requireAdminAuthAPI(): Promise<NextResponse | null> {
  const session = await getSession();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin access required." },
      { status: 401 }
    );
  }
  return null;
}

export async function getAuthUser() {
  const session = await getSession();
  return session?.user || null;
}

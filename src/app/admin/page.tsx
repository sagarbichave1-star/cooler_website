import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AdminPanel } from "@/components/admin-panel";
import {
  adminConfigured,
  adminCookie,
  validAdminSession,
} from "@/lib/admin-token";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
  alternates: { canonical: "/admin" },
};

export default async function AdminPage() {
  const authenticated = validAdminSession(
    (await cookies()).get(adminCookie)?.value,
  );
  return (
    <AdminPanel authenticated={authenticated} configured={adminConfigured()} />
  );
}

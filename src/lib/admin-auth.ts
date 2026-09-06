import "server-only";
import { cookies } from "next/headers";
import { adminCookie, validAdminSession } from "./admin-token";

export async function isAdmin() {
  return validAdminSession((await cookies()).get(adminCookie)?.value);
}

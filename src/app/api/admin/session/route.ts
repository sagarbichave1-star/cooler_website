import { cookies } from "next/headers";
import {
  adminConfigured,
  adminCookie,
  createAdminSession,
  sessionCookieOptions,
  validAccessKey,
  validAdminSession,
} from "@/lib/admin-token";
import { field, record } from "@/lib/admin-validation";
import {
  formFailure,
  privateReply,
  readFormJson,
  throttle,
} from "@/lib/request-guards";

export const dynamic = "force-dynamic";

export async function GET() {
  return privateReply({
    authenticated: validAdminSession((await cookies()).get(adminCookie)?.value),
    configured: adminConfigured(),
  });
}

export async function POST(request: Request) {
  try {
    // A global bucket cannot be bypassed using forged forwarded-IP headers.
    throttle("admin-login", 10);
    const input = record(await readFormJson(request));
    if (!adminConfigured())
      return privateReply(
        {
          error:
            "Admin access has not been configured. Add ADMIN_ACCESS_KEY and ADMIN_SESSION_SECRET to the server environment.",
        },
        503,
      );
    if (!validAccessKey(field(input, "key", 256)))
      return privateReply({ error: "Invalid access key." }, 401);
    (await cookies()).set(
      adminCookie,
      createAdminSession(),
      sessionCookieOptions,
    );
    return privateReply({ authenticated: true });
  } catch (error) {
    return formFailure(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await readFormJson(request);
    (await cookies()).set(adminCookie, "", {
      ...sessionCookieOptions,
      maxAge: 0,
    });
    return privateReply({ authenticated: false });
  } catch (error) {
    return formFailure(error);
  }
}

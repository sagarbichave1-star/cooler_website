import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

const SESSION_LIFETIME = 60 * 60 * 4;
export const adminCookie = "tirupati-admin-session";

function credentials() {
  const key = process.env.ADMIN_ACCESS_KEY || "";
  const secret = process.env.ADMIN_SESSION_SECRET || "";
  return key.length >= 32 &&
    key.length <= 256 &&
    secret.length >= 32 &&
    key !== secret
    ? { key, secret }
    : null;
}

export function adminConfigured() {
  return credentials() !== null;
}

export function validAccessKey(input: string) {
  const config = credentials();
  if (!config || input.length > 256) return false;
  return timingSafeEqual(
    createHash("sha256").update(input).digest(),
    createHash("sha256").update(config.key).digest(),
  );
}

function sign(payload: string) {
  const config = credentials();
  if (!config) throw new Error("Admin access is not configured.");
  // Rotating either secret invalidates existing sessions.
  return createHmac("sha256", config.secret)
    .update(`${config.key}:${payload}`)
    .digest("base64url");
}

export function createAdminSession(now = Date.now()) {
  const payload = `${Math.floor(now / 1000) + SESSION_LIFETIME}.${randomBytes(24).toString("base64url")}`;
  return `${payload}.${sign(payload)}`;
}

export function validAdminSession(token: string | undefined, now = Date.now()) {
  if (!token || !credentials() || token.length > 200) return false;
  const parts = token.split(".");
  if (
    parts.length !== 3 ||
    !/^\d+$/.test(parts[0]) ||
    !/^[\w-]{32}$/.test(parts[1])
  )
    return false;
  const expiry = Number(parts[0]);
  const current = Math.floor(now / 1000);
  if (expiry <= current || expiry > current + SESSION_LIFETIME) return false;
  const expected = Buffer.from(sign(`${parts[0]}.${parts[1]}`));
  const signature = Buffer.from(parts[2]);
  return (
    expected.length === signature.length && timingSafeEqual(expected, signature)
  );
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_LIFETIME,
};

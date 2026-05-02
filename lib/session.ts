import { jwtVerify, SignJWT } from "jose";

export const SESSION_COOKIE = "hclub_session";
export const SESSION_COOKIE_SECURE = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://") ?? process.env.NODE_ENV === "production";

export type SessionPayload = {
  sub: string;
  email: string;
  role: "admin" | "user";
};

function getSecret() {
  const secret = process.env.JWT_SECRET || "development-only-hclub-secret-change-before-production";
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken(token?: string) {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || typeof payload.email !== "string" || (payload.role !== "admin" && payload.role !== "user")) {
      return null;
    }

    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role
    } satisfies SessionPayload;
  } catch {
    return null;
  }
}

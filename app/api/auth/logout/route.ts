import { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_COOKIE_SECURE } from "@/lib/session";

export async function POST() {
  const response = NextResponse.json({ ok: true, data: { loggedOut: true } });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: SESSION_COOKIE_SECURE,
    path: "/",
    maxAge: 0
  });
  return response;
}

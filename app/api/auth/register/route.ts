import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { handleRouteError, ok } from "@/lib/http";
import { registerSchema } from "@/lib/validation";
import { SESSION_COOKIE, SESSION_COOKIE_SECURE, signSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const payload = registerSchema.parse(await request.json());
    const passwordHash = await bcrypt.hash(payload.password, 12);
    const user = await prisma.user.create({
      data: {
        email: payload.email.toLowerCase(),
        passwordHash,
        role: "user",
        profileInfo: payload.profileInfo || null
      },
      select: { id: true, email: true, role: true }
    });

    const token = await signSession({ sub: user.id, email: user.email, role: user.role as "user" });
    const response = ok(user, 201);
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: SESSION_COOKIE_SECURE,
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });
    return response;
  } catch (error) {
    return handleRouteError(error);
  }
}

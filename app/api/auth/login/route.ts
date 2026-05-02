import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ApiError, handleRouteError, ok } from "@/lib/http";
import { SESSION_COOKIE, SESSION_COOKIE_SECURE, signSession } from "@/lib/session";
import { loginSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const payload = loginSchema.parse(await request.json());
    const user = await prisma.user.findUnique({
      where: { email: payload.email.toLowerCase() }
    });

    if (!user) {
      throw new ApiError(401, "Email hoặc mật khẩu không đúng.");
    }

    const validPassword = await bcrypt.compare(payload.password, user.passwordHash);
    if (!validPassword) {
      throw new ApiError(401, "Email hoặc mật khẩu không đúng.");
    }

    const token = await signSession({
      sub: user.id,
      email: user.email,
      role: user.role === "admin" ? "admin" : "user"
    });

    const response = ok({ id: user.id, email: user.email, role: user.role });
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

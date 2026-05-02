import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { ApiError } from "@/lib/http";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

export async function getSession() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: session.sub },
    select: {
      id: true,
      email: true,
      role: true,
      profileInfo: true,
      createdAt: true
    }
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new ApiError(401, "Bạn cần đăng nhập.");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") {
    throw new ApiError(403, "Chỉ quản trị viên mới được thực hiện thao tác này.");
  }

  return user;
}

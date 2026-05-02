import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ ok: false, error: { message, details } }, { status });
}

export function handleRouteError(error: unknown) {
  if (error instanceof ApiError) {
    return fail(error.message, error.status, error.details);
  }

  if (error instanceof ZodError) {
    return fail("Dữ liệu không hợp lệ.", 422, error.flatten());
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return fail("Dữ liệu đã tồn tại, vui lòng kiểm tra slug/email.", 409, error.meta);
    }
  }

  console.error(error);
  return fail("Có lỗi hệ thống, vui lòng thử lại sau.", 500);
}

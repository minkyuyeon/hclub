import { ApiError } from "@/lib/http";

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

export function assertRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  current.count += 1;
  if (current.count > limit) {
    throw new ApiError(429, "Bạn gửi yêu cầu quá nhanh. Vui lòng thử lại sau vài phút.");
  }
}

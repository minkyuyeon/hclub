import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/auth";
import { ApiError, handleRouteError, ok } from "@/lib/http";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
const ALLOWED_PREFIXES = ["image/", "video/"];

function cleanExtension(filename: string, mime: string) {
  const ext = extname(filename).toLowerCase();
  if (ext) return ext;
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  if (mime === "image/gif") return ".gif";
  if (mime === "video/mp4") return ".mp4";
  if (mime === "video/webm") return ".webm";
  return "";
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new ApiError(400, "Không tìm thấy file upload.");
    }

    if (!ALLOWED_PREFIXES.some((prefix) => file.type.startsWith(prefix))) {
      throw new ApiError(415, "Chỉ hỗ trợ upload ảnh hoặc video.");
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      throw new ApiError(413, "File quá lớn. Giới hạn hiện tại là 50MB.");
    }

    const month = new Date().toISOString().slice(0, 7);
    const extension = cleanExtension(file.name, file.type);
    const filename = `${Date.now()}-${randomUUID()}${extension}`;
    const uploadDir = join(process.cwd(), "public", "uploads", month);
    const target = join(uploadDir, filename);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(target, Buffer.from(await file.arrayBuffer()));

    return ok({
      url: `/uploads/${month}/${filename}`,
      mimeType: file.type,
      size: file.size
    }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}

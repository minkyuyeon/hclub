"use client";

import { DragEvent, useRef, useState } from "react";
import type { ApiResponse } from "@/lib/types";

type UploadResult = {
  url: string;
  mimeType: string;
  size: number;
};

type Props = {
  name?: string;
  value?: string | null;
  onChange?: (value: string) => void;
};

async function uploadThumbnail(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/uploads", {
    method: "POST",
    body: formData
  });
  const payload = await response.json() as ApiResponse<UploadResult>;
  if (!payload.ok || !payload.data?.url) {
    throw new Error(payload.error?.message || "Không upload được ảnh.");
  }
  return payload.data.url;
}

export function ThumbnailDropzone({ name = "thumbnail", value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(value || "");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleFile(file?: File) {
    if (!file) return;
    setLoading(true);
    setMessage("");
    try {
      const url = await uploadThumbnail(file);
      setPreview(url);
      onChange?.(url);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không upload được ảnh.");
    } finally {
      setLoading(false);
    }
  }

  function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    void handleFile(event.dataTransfer.files?.[0]);
  }

  return (
    <div className="grid gap-3">
      <input type="hidden" name={name} value={preview} />
      <div
        className={[
          "group relative grid min-h-56 cursor-pointer place-items-center overflow-hidden rounded-2xl border border-dashed p-4 text-center transition",
          dragging ? "border-yellow-300 bg-yellow-400/10" : "border-white/15 bg-slate-950/60 hover:border-yellow-300/40 hover:bg-slate-950/80"
        ].join(" ")}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={drop}
        role="button"
        tabIndex={0}
      >
        {preview ? (
          <img className="absolute inset-0 h-full w-full object-cover opacity-90 transition group-hover:scale-[1.02]" src={preview} alt="Thumbnail preview" loading="lazy" decoding="async" />
        ) : null}
        <div className="relative z-10 rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 shadow-xl backdrop-blur">
          <div className="text-sm font-black text-yellow-200">{loading ? "Đang upload..." : preview ? "Thay ảnh đại diện" : "Kéo thả ảnh đại diện"}</div>
          <div className="mt-1 text-xs font-semibold text-slate-400">JPG, PNG, WEBP. Click để chọn file.</div>
        </div>
        <input
          ref={inputRef}
          className="hidden"
          type="file"
          accept="image/*"
          onChange={(event) => void handleFile(event.target.files?.[0])}
        />
      </div>
      <input
        className="h-11 rounded-xl border border-white/10 bg-slate-950/70 px-3 text-sm text-slate-200 outline-none transition focus:border-yellow-300/50"
        placeholder="/uploads/..."
        value={preview}
        onChange={(event) => {
          setPreview(event.target.value);
          onChange?.(event.target.value);
        }}
      />
      {message ? <p className="text-sm font-bold text-red-300">{message}</p> : null}
    </div>
  );
}

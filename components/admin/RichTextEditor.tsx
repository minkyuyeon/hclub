"use client";

import { Editor } from "@tinymce/tinymce-react";
import type { ApiResponse } from "@/lib/types";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

type UploadResult = {
  url: string;
  mimeType: string;
  size: number;
};

async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/uploads", {
    method: "POST",
    body: formData
  });
  const payload = await response.json() as ApiResponse<UploadResult>;

  if (!payload.ok || !payload.data?.url) {
    throw new Error(payload.error?.message || "Không upload được file.");
  }

  return payload.data;
}

export function RichTextEditor({ value, onChange }: Props) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-black/20">
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        value={value}
        onEditorChange={onChange}
        init={{
          height: 420,
          menubar: false,
          branding: false,
          promotion: false,
          skin: "oxide-dark",
          content_css: "dark",
          convert_urls: false,
          plugins: "autolink autoresize code image link lists media table visualblocks wordcount",
          toolbar: "undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | forecolor backcolor | bullist numlist | link image media iframeembed uploadmedia | table | code",
          block_formats: "Đoạn=p; Heading 2=h2; Heading 3=h3; Heading 4=h4; Quote=blockquote",
          image_advtab: true,
          media_live_embeds: true,
          media_filter_html: false,
          extended_valid_elements: "iframe[src|width|height|frameborder|allow|allowfullscreen|style|title|referrerpolicy],video[src|controls|width|height|poster|style],source[src|type]",
          valid_children: "+body[iframe|video|source]",
          content_style: "body{font-family:Inter,Arial,sans-serif;font-size:16px;line-height:1.75;color:#f8fafc;background:#06070a;} img,video,iframe{max-width:100%;border-radius:12px;} iframe{aspect-ratio:16/9;width:100%;}",
          images_upload_handler: async (blobInfo) => {
            const blob = blobInfo.blob();
            const file = new File([blob], blobInfo.filename(), { type: blob.type });
            const result = await uploadFile(file);
            return result.url;
          },
          file_picker_types: "image media",
          file_picker_callback: (callback, _value, meta) => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = meta.filetype === "image" ? "image/*" : "image/*,video/*";
            input.onchange = async () => {
              const file = input.files?.[0];
              if (!file) return;
              const result = await uploadFile(file);
              callback(result.url, { title: file.name });
            };
            input.click();
          },
          setup: (editor) => {
            editor.ui.registry.addButton("uploadmedia", {
              text: "Upload",
              tooltip: "Upload ảnh/video",
              onAction: () => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*,video/*";
                input.onchange = async () => {
                  const file = input.files?.[0];
                  if (!file) return;
                  const result = await uploadFile(file);
                  if (result.mimeType.startsWith("image/")) {
                    editor.insertContent(`<img src="${result.url}" alt="" loading="lazy">`);
                    return;
                  }
                  editor.insertContent(`<video controls src="${result.url}"></video>`);
                };
                input.click();
              }
            });
            editor.ui.registry.addButton("iframeembed", {
              text: "Iframe",
              tooltip: "Nhúng iframe YouTube/TikTok/Facebook",
              onAction: () => {
                const code = window.prompt("Dán mã iframe embed:");
                if (!code) return;
                if (!code.toLowerCase().includes("<iframe")) {
                  window.alert("Mã nhúng phải là iframe.");
                  return;
                }
                editor.insertContent(code);
              }
            });
          }
        }}
      />
    </div>
  );
}

import { PostForm } from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default function AdminPostCreatePage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">Tạo bài viết</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Soạn nội dung bằng rich text editor, cấu hình trạng thái và ảnh đại diện ở cột phải.</p>
      </div>
      <PostForm />
    </div>
  );
}

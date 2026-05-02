import { EventForm } from "@/components/admin/EventForm";

export const dynamic = "force-dynamic";

export default function AdminEventCreatePage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">Tạo sự kiện</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Soạn nội dung chính bằng rich text editor, cấu hình trạng thái, thời gian và ảnh đại diện ở cột phải.</p>
      </div>
      <EventForm />
    </div>
  );
}

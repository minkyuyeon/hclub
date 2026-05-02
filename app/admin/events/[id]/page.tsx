import { notFound } from "next/navigation";
import { EventForm } from "@/components/admin/EventForm";
import { prisma } from "@/lib/db";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function AdminEventEditPage({ params }: PageProps) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">Sửa sự kiện</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{event.title}</p>
      </div>
      <EventForm initialEvent={{
        id: event.id,
        title: event.title,
        slug: event.slug,
        description: event.description,
        date: event.date.toISOString(),
        location: event.location,
        status: event.status,
        thumbnail: event.thumbnail
      }} />
    </div>
  );
}

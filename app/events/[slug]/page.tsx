import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { EventBookingForm } from "@/components/site/EventBookingForm";
import { prisma } from "@/lib/db";
import { plainTextFromHtml, sanitizeRichText } from "@/lib/sanitize";
import { serializeEvent } from "@/lib/serializers";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findFirst({
    where: { OR: [{ slug }, { id: slug }], status: "published" }
  });

  if (!event) {
    return {};
  }

  const description = plainTextFromHtml(event.description, 180) || `${event.title} tại H Club Hạ Long.`;
  const image = event.thumbnail || "/images/hero-space.jpg";

  return {
    title: `${event.title} | H Club`,
    description,
    openGraph: {
      title: event.title,
      description,
      type: "article",
      url: `/events/${event.slug}`,
      images: [{ url: image, width: 1200, height: 630, alt: event.title }]
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description,
      images: [image]
    }
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await prisma.event.findFirst({
    where: { OR: [{ slug }, { id: slug }], status: "published" }
  });

  if (!event) {
    notFound();
  }

  const publicEvent = serializeEvent(event);
  const safeDescription = sanitizeRichText(event.description);

  return (
    <div className="site-shell">
      <Header />
      <main className="section">
        <a className="btn btn-ghost mb-8" href="/#events">← Quay lại lịch sự kiện</a>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <article>
            <img className="mb-7 aspect-[16/9] w-full rounded-lg border border-[color:var(--line)] object-cover" src={event.thumbnail || "/images/hero-space.jpg"} alt={event.title} loading="eager" decoding="async" />
            <div className="section-kicker">{event.date.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}</div>
            <h1 className="mt-3 font-display text-6xl font-bold leading-none">{event.title}</h1>
            <div className="mt-5 text-lg leading-8 text-[color:var(--soft)] [&_iframe]:my-6 [&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:rounded-lg [&_iframe]:border [&_iframe]:border-white/10" dangerouslySetInnerHTML={{ __html: safeDescription }} />
            <div className="event-meta mt-6">
              <span>{event.location}</span>
              <span>Đặt bàn trước</span>
              <span>Hotline 094.509.5555</span>
            </div>
          </article>
          <EventBookingForm event={publicEvent} />
        </div>
      </main>
    </div>
  );
}

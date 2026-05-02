"use client";

import { useEffect, useMemo, useState } from "react";
import { fallbackEvents } from "@/lib/site-data";
import type { ApiResponse, PublicEvent } from "@/lib/types";

const filters = [
  { label: "Tất cả", value: "all" },
  { label: "Live Show", value: "live" },
  { label: "Guest DJ", value: "dj" },
  { label: "Closing", value: "closing" }
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" }).format(new Date(value));
}

function filterType(event: PublicEvent) {
  const text = `${event.title} ${event.description}`.toLowerCase();
  if (text.includes("closing") || text.includes("mochi")) return "closing";
  if (text.includes("dj")) return "dj";
  return "live";
}

function plainText(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function DynamicEventsSection() {
  const [events, setEvents] = useState<PublicEvent[]>(fallbackEvents);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch("/api/events?limit=10&upcoming=false")
      .then((response) => response.json() as Promise<ApiResponse<PublicEvent[]>>)
      .then((payload) => {
        if (alive && payload.ok && payload.data?.length) {
          setEvents(payload.data);
        }
      })
      .catch(() => {
        setEvents(fallbackEvents);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const visibleEvents = useMemo(() => {
    return events.filter((event) => activeFilter === "all" || filterType(event) === activeFilter);
  }, [activeFilter, events]);

  return (
    <section className="section" id="events">
      <div className="section-head">
        <div>
          <div className="section-kicker">Lịch tháng 5</div>
          <h2>10 đêm nhạc trong <em>H Club Live Show</em></h2>
        </div>
        <p>Lọc nhanh theo loại show, chọn event phù hợp rồi chuyển thẳng xuống form đặt bàn.</p>
      </div>

      <div className="filter-row">
        {filters.map((filter) => (
          <button
            className={activeFilter === filter.value ? "filter-pill active" : "filter-pill"}
            key={filter.value}
            type="button"
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {loading ? <p className="mb-4 text-[color:var(--muted)]">Đang tải lịch sự kiện...</p> : null}

      <div className="events-grid">
        {visibleEvents.map((event) => {
          const date = new Date(event.date);
          return (
            <article className="event-card" key={event.id}>
              <a href={`/events/${event.slug}`}>
                <div className="event-media">
                  <img src={event.thumbnail || "/images/hero-space.jpg"} alt={event.title} loading="lazy" decoding="async" />
                  <div className="date-badge">
                    <strong>{date.getDate().toString().padStart(2, "0")}</strong>
                    <span>May</span>
                  </div>
                </div>
                <div className="event-body">
                  <h3>{event.title}</h3>
                  <p>{plainText(event.description)}</p>
                  <div className="event-meta">
                    <span>{formatDate(event.date)}</span>
                    <span>Đặt bàn trước</span>
                    <span>Hotline 094.509.5555</span>
                  </div>
                </div>
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}

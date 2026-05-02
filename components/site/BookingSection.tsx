"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { TABLE_TYPE_LABELS, TABLE_TYPES, type TableType } from "@/lib/constants";
import { fallbackEvents } from "@/lib/site-data";
import type { ApiResponse, PublicEvent } from "@/lib/types";

function keyFromDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function eventKey(event: PublicEvent) {
  return keyFromDate(new Date(event.date));
}

export function BookingSection() {
  const [events, setEvents] = useState<PublicEvent[]>(fallbackEvents);
  const [selectedKey, setSelectedKey] = useState<string>(() => eventKey(fallbackEvents[0]));
  const [guestCount, setGuestCount] = useState(4);
  const [tableType, setTableType] = useState<TableType>("BAN_VIP");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/events?limit=31&upcoming=false")
      .then((response) => response.json() as Promise<ApiResponse<PublicEvent[]>>)
      .then((payload) => {
        if (payload.ok && payload.data?.length) {
          setEvents(payload.data);
          setSelectedKey(eventKey(payload.data[0]));
        }
      })
      .catch(() => setEvents(fallbackEvents));
  }, []);

  const today = useMemo(() => {
    const value = new Date();
    value.setHours(0, 0, 0, 0);
    return value;
  }, []);
  const currentMonth = useMemo(() => new Date(today.getFullYear(), today.getMonth(), 1), [today]);
  const eventsByDate = useMemo(() => {
    return events.reduce<Map<string, PublicEvent[]>>((map, event) => {
      const key = eventKey(event);
      map.set(key, [...(map.get(key) || []), event]);
      return map;
    }, new Map());
  }, [events]);
  const selectedEvents = eventsByDate.get(selectedKey) || [];
  const selectedEvent = selectedEvents[0];
  const selectedDate = selectedKey ? new Date(`${selectedKey}T00:00:00`) : today;
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const leading = (firstDay.getDay() + 6) % 7;
  const days = Array.from({ length: leading + lastDay }, (_, index) => (index < leading ? null : index - leading + 1));

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    if (!selectedEvent) {
      setMessage("Ngày này chưa có show đặc biệt trên hệ thống. Vui lòng gọi hotline để giữ bàn đêm thường.");
      setMessageType("error");
      return;
    }

    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: selectedEvent.id,
          guestCount,
          tableType,
          customerName: form.get("customerName"),
          customerPhone: form.get("customerPhone"),
          customerEmail: form.get("customerEmail"),
          note: form.get("note")
        })
      });
      const payload = await response.json() as ApiResponse<unknown>;
      if (!payload.ok) {
        throw new Error(payload.error?.message || "Không gửi được yêu cầu.");
      }

      setMessage("Đã gửi yêu cầu giữ bàn. Nhân viên H Club sẽ gọi lại để xác nhận.");
      setMessageType("success");
      event.currentTarget.reset();
      setGuestCount(4);
      setTableType("BAN_VIP");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không gửi được yêu cầu.");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section" id="booking">
      <div className="section-head">
        <div>
          <div className="section-kicker">Đặt bàn</div>
          <h2>Lên kèo cho <em>đêm của bạn</em></h2>
        </div>
        <p>Chọn ngày trên lịch tháng, xem show của ngày đó rồi tiếp tục chọn loại bàn và để lại thông tin liên hệ.</p>
      </div>

      <div className="booking-wrap">
        <section className="booking-calendar-panel" aria-label="Lịch tháng đặt bàn">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="section-kicker !text-base">Bước 1</span>
              <h3 className="mt-2 text-2xl font-bold">Tháng {currentMonth.getMonth() + 1}/{currentMonth.getFullYear()}</h3>
            </div>
            <div className="status-chip">{events.length} show</div>
          </div>

          <div className="weekday-row" aria-hidden="true">
            <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
          </div>
          <div className="calendar-grid">
            {days.map((day, index) => {
              if (!day) return <span className="calendar-spacer" key={`blank-${index}`} />;
              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const key = keyFromDate(date);
              const hasShow = eventsByDate.has(key);
              return (
                <button
                  className={[
                    "calendar-day",
                    hasShow ? "has-show" : "",
                    selectedKey === key ? "selected" : ""
                  ].join(" ")}
                  key={key}
                  type="button"
                  disabled={date < today}
                  onClick={() => setSelectedKey(key)}
                  title={hasShow ? eventsByDate.get(key)?.map((item) => item.title).join(", ") : "Đêm thường tại H Club"}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-lg border border-[color:var(--line)] bg-black/20 p-4">
            <strong>{selectedDate.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}</strong>
            <div className="mt-2 text-sm leading-6 text-[color:var(--soft)]">
              {selectedEvents.length ? selectedEvents.map((item) => item.title).join(" + ") : "Đêm thường tại H Club, hotline sẽ xác nhận line-up khi giữ bàn."}
            </div>
          </div>
        </section>

        <form className="booking-panel" onSubmit={submitBooking}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="section-kicker !text-base">Bước 2</span>
              <h3 className="mt-2 text-2xl font-bold">Thông tin giữ bàn</h3>
            </div>
            <div className="status-chip">{selectedEvent ? "Đang nhận đặt bàn" : "Hotline"}</div>
          </div>

          <div className="booking-summary">
            <div className="summary-row"><span>Ngày</span><strong>{selectedKey}</strong></div>
            <div className="summary-row"><span>Show</span><strong>{selectedEvent?.title || "Đêm thường"}</strong></div>
            <div className="summary-row"><span>Loại bàn</span><strong>{TABLE_TYPE_LABELS[tableType]}</strong></div>
          </div>

          <div className="form-grid">
            <div className="field">
              <label htmlFor="guestCount">Số khách</label>
              <input id="guestCount" type="number" min="1" step="1" value={guestCount} onChange={(event) => setGuestCount(Math.max(1, Number(event.target.value || 1)))} />
            </div>
            <div className="field">
              <label htmlFor="tableType">Loại bàn</label>
              <select id="tableType" value={tableType} onChange={(event) => setTableType(event.target.value as TableType)}>
                {TABLE_TYPES.map((type) => (
                  <option key={type} value={type}>{TABLE_TYPE_LABELS[type]}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="customerName">Tên khách</label>
              <input id="customerName" name="customerName" required placeholder="Ví dụ: Anh Nam" />
            </div>
            <div className="field">
              <label htmlFor="customerPhone">Số điện thoại</label>
              <input id="customerPhone" name="customerPhone" required inputMode="tel" placeholder="09xx xxx xxx" />
            </div>
            <div className="field full">
              <label htmlFor="customerEmail">Email</label>
              <input id="customerEmail" name="customerEmail" type="email" placeholder="email@example.com" />
            </div>
            <div className="field full">
              <label htmlFor="note">Ghi chú</label>
              <textarea id="note" name="note" placeholder="Sinh nhật, yêu cầu vị trí bàn, số lượng khách nữ/nam..." />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? "Đang gửi..." : "GỬI YÊU CẦU GIỮ BÀN"}</button>
            <a className="btn btn-gold" href="tel:0945095555">Gọi hotline</a>
          </div>
          <p className={`form-message ${messageType === "success" ? "text-emerald-300" : messageType === "error" ? "text-red-300" : ""}`} role="status">{message}</p>
        </form>
      </div>
    </section>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { TABLE_TYPE_LABELS, TABLE_TYPES, type TableType } from "@/lib/constants";
import type { ApiResponse, PublicEvent } from "@/lib/types";

type Props = {
  event: PublicEvent;
};

export function EventBookingForm({ event }: Props) {
  const [guestCount, setGuestCount] = useState(2);
  const [tableType, setTableType] = useState<TableType>("BAN_VIP");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(false);

  async function submit(eventSubmit: FormEvent<HTMLFormElement>) {
    eventSubmit.preventDefault();
    const form = new FormData(eventSubmit.currentTarget);
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: event.id,
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
        throw new Error(payload.error?.message || "Không gửi được yêu cầu giữ bàn.");
      }
      setMessage("Đã nhận yêu cầu giữ bàn. H Club sẽ liên hệ xác nhận.");
      setMessageType("success");
      eventSubmit.currentTarget.reset();
      setGuestCount(2);
      setTableType("BAN_VIP");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không gửi được yêu cầu giữ bàn.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="booking-panel" onSubmit={submit}>
      <div className="section-kicker">Booking</div>
      <h2 className="!mt-2 !text-4xl">Đặt bàn trước</h2>
      <div className="booking-summary">
        <div className="summary-row"><span>Sự kiện</span><strong>{event.title}</strong></div>
        <div className="summary-row"><span>Ngày diễn ra</span><strong>{new Date(event.date).toLocaleDateString("vi-VN")}</strong></div>
        <div className="summary-row"><span>Loại bàn</span><strong>{TABLE_TYPE_LABELS[tableType]}</strong></div>
      </div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="detailGuestCount">Số khách</label>
          <input id="detailGuestCount" type="number" min="1" step="1" value={guestCount} onChange={(e) => setGuestCount(Math.max(1, Number(e.target.value || 1)))} />
        </div>
        <div className="field">
          <label htmlFor="detailTableType">Loại bàn</label>
          <select id="detailTableType" value={tableType} onChange={(eventChange) => setTableType(eventChange.target.value as TableType)}>
            {TABLE_TYPES.map((type) => (
              <option key={type} value={type}>{TABLE_TYPE_LABELS[type]}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="detailName">Tên khách</label>
          <input id="detailName" name="customerName" required />
        </div>
        <div className="field">
          <label htmlFor="detailPhone">Số điện thoại</label>
          <input id="detailPhone" name="customerPhone" inputMode="tel" required />
        </div>
        <div className="field full">
          <label htmlFor="detailEmail">Email</label>
          <input id="detailEmail" name="customerEmail" type="email" />
        </div>
        <div className="field full">
          <label htmlFor="detailNote">Ghi chú</label>
          <textarea id="detailNote" name="note" />
        </div>
      </div>

      <button className="btn btn-primary mt-4 w-full" disabled={loading} type="submit">
        {loading ? "Đang gửi..." : "GỬI YÊU CẦU GIỮ BÀN"}
      </button>
      <p className={`form-message ${messageType === "success" ? "text-emerald-300" : messageType === "error" ? "text-red-300" : ""}`}>{message}</p>
    </form>
  );
}

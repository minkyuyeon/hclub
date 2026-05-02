"use client";

import { useState } from "react";
import { menuPages } from "@/lib/site-data";

export function MenuSection() {
  const [activeImage, setActiveImage] = useState<{ src: string; alt: string } | null>(null);

  return (
    <section className="section" id="menu">
      <div className="section-head">
        <div>
          <div className="section-kicker">Menu</div>
          <h2>Menu mới cho <em>đêm của bạn</em></h2>
        </div>
        <p>Click vào từng trang menu để mở khung zoom trực tiếp trên website.</p>
      </div>

      <div className="menu-layout">
        <div className="menu-pages-grid">
          {menuPages.map((page) => (
            <button className="menu-page" key={page.src} type="button" onClick={() => setActiveImage(page)}>
              <img src={page.src} alt={page.alt} loading="lazy" decoding="async" />
            </button>
          ))}
        </div>

        <aside className="menu-note">
          <div className="section-kicker">Booking</div>
          <h3 className="mt-2 text-2xl font-bold">Giữ bàn nhanh qua hotline</h3>
          <p className="my-4 text-[color:var(--soft)] leading-7">Chọn ngày, loại bàn và combo ở form bên dưới. Nhân viên sẽ gọi xác nhận vị trí bàn và chi tiết phụ thu nếu có.</p>
          <a className="btn btn-gold w-full" href="tel:0945095555">Gọi 094 509 5555</a>
        </aside>
      </div>

      {activeImage ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4" role="dialog" aria-modal="true" onClick={() => setActiveImage(null)}>
          <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-lg border border-[color:var(--line-2)] bg-[#08080b]" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[color:var(--line)] p-3">
              <strong>{activeImage.alt}</strong>
              <button className="btn btn-ghost !min-h-9 !px-3" type="button" onClick={() => setActiveImage(null)}>Đóng</button>
            </div>
            <div className="max-h-[calc(92vh-62px)] overflow-auto p-3">
              <img className="mx-auto max-h-[calc(92vh-90px)] w-auto rounded-md object-contain" src={activeImage.src} alt={activeImage.alt} loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";

const slides = [
  { src: "/images/khong_gian_1.jpg", label: "Sân khấu" },
  { src: "/images/khong_gian_2.jpg", label: "Live show" },
  { src: "/images/khong_gian_3.jpg", label: "Múa cổ trang" },
  { src: "/images/khong_gian_4.jpg", label: "Xiếc nghệ thuật" },
  { src: "/images/khong_gian_5.jpg", label: "Ánh sáng" }
];

export function SpaceSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 3000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="section" id="space">
      <div className="section-head">
        <div>
          <div className="section-kicker">Không gian</div>
          <h2>Một đêm tại <em>H Club</em></h2>
        </div>
        <p>Âm thanh, ánh sáng, sân khấu và line-up được dựng cho trải nghiệm nightlife cường độ cao.</p>
      </div>

      <div className="space-showcase">
        <div className="space-video">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/tRGnLFgUdD0?si=ijHZZkOgpChebAz1"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            loading="lazy"
          />
        </div>

        <div className="space-slider" aria-label="Hình ảnh không gian H Club">
          <div className="space-slider-track" style={{ "--space-slide-index": active } as React.CSSProperties}>
            {slides.map((slide) => (
              <figure className="space-slide" key={slide.src}>
                <img src={slide.src} alt={slide.label} loading="lazy" decoding="async" />
                <span>{slide.label}</span>
              </figure>
            ))}
          </div>
          <div className="space-slider-dots" aria-label="Chọn ảnh không gian">
            {slides.map((slide, index) => (
              <button
                className={active === index ? "space-dot is-active" : "space-dot"}
                key={slide.src}
                type="button"
                aria-label={`Xem ảnh ${index + 1}`}
                aria-current={active === index}
                onClick={() => setActive(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Hero() {
  return (
    <section className="hero" aria-label="H Club Live Show">
      <div className="hero-inner">
        <div>
          <div className="section-kicker">May 2026 · H Club Mode: On</div>
          <h1>H Club Live Show</h1>
          <p className="hero-copy">
            Tháng 5 này, H CLUB chính thức nâng cấp cuộc chơi với chuỗi live show âm nhạc xuyên tháng,
            nơi mọi giới hạn được xoá bỏ và đẳng cấp tiệc tùng được đẩy lên mức cực đại.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#booking">Giữ bàn ngay</a>
            <a className="btn btn-ghost" href="#events">Xem lịch tháng 5</a>
          </div>
          <div className="hero-stats">
            <div><strong>10</strong><span>Đêm sự kiện</span></div>
            <div><strong>22:00</strong><span>Giờ bắt đầu</span></div>
            <div><strong>094 509 5555</strong><span>Hotline đặt bàn</span></div>
          </div>
        </div>

        <aside className="next-event" aria-label="Sự kiện gần nhất">
          <img src="/images/hero-space.jpg" alt="Không gian H Club với ánh sáng sân khấu" loading="eager" decoding="async" />
          <small>Next show · Thứ 7, 02.05</small>
          <h2>Hot Holiday Closing</h2>
          <p>DJ CUKIU đốt nóng sân khấu với những track căng cực, hottrend và không khí cuối kỳ nghỉ đúng nghĩa overheat.</p>
          <a className="btn btn-gold w-full" href="#booking">Chọn bàn cho đêm này</a>
        </aside>
      </div>
    </section>
  );
}

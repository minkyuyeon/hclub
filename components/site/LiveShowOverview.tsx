import { lineup, timeline } from "@/lib/site-data";

export function LiveShowOverview() {
  return (
    <section className="section" id="live-show">
      <div className="overview-grid">
        <div>
          <div className="section-kicker">H Club Live Show | May 2026</div>
          <h2>H Club Mode: On</h2>
          <p className="mt-5 text-[color:var(--soft)] leading-7">
            Không chỉ là party cuối tuần, tháng 5 là đại tiệc âm nhạc, ánh sáng và cảm xúc tại H CLUB.
          </p>
          <ul className="overview-points">
            <li>Không gian Siêu Vũ Trường hoành tráng</li>
            <li>Hệ thống âm thanh, ánh sáng công nghệ triệu đô</li>
            <li>Trải nghiệm giải trí đẳng cấp quốc tế, top nightlife Việt Nam</li>
          </ul>
          <p className="quote">“Nơi bạn không chỉ đến để chơi, mà để sống trọn vẹn với từng nhịp beat.”</p>
        </div>

        <div>
          <div className="lineup-board" aria-label="Line-up tháng 5 năm 2026">
            {lineup.map((item) => (
              <div className="lineup-item" key={item.date}>
                <time>{item.label}</time>
                <strong>{item.title}</strong>
                <a className="btn btn-gold !min-h-8 !px-3 !text-xs" href={`/#booking?date=${item.date}`}>Đặt bàn</a>
              </div>
            ))}
          </div>
          <div className="tagline-list mt-4">
            <div className="tag-card">Mỗi tuần là một màu sắc ấn tượng</div>
            <div className="tag-card">Mỗi đêm là một trải nghiệm khó quên</div>
            <div className="tag-card">Mỗi khách hàng đều muốn quay lại</div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="section-head">
          <div>
            <div className="section-kicker">Lịch đặc biệt theo line-up</div>
            <h2 className="!text-4xl">Timeline liveshow</h2>
          </div>
          <p>Với những đêm đặc biệt, H Club triển khai thêm các performance ngoài DJ show.</p>
        </div>
        <div className="timeline-grid">
          {timeline.map((item) => (
            <div className="timeline-card" key={item.time}>
              <strong>{item.time}</strong>
              <span>{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

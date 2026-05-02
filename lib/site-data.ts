export const lineup = [
  { date: "2026-05-01", label: "Thứ 6 · 01.05", title: "DJ LINH KEM" },
  { date: "2026-05-02", label: "Thứ 7 · 02.05", title: "DJ CUKIU" },
  { date: "2026-05-08", label: "Thứ 6 · 08.05", title: "DJ LIN" },
  { date: "2026-05-09", label: "Thứ 7 · 09.05", title: "CA SĨ QUANG ĐĂNG TRẦN" },
  { date: "2026-05-15", label: "Thứ 6 · 15.05", title: "DJ ALEXA" },
  { date: "2026-05-16", label: "Thứ 7 · 16.05", title: "MC GOKU + DJ BÁC SĨ HẢI" },
  { date: "2026-05-22", label: "Thứ 6 · 22.05", title: "DJ HẠNH COCA" },
  { date: "2026-05-23", label: "Thứ 7 · 23.05", title: "DJ MINH ANH" },
  { date: "2026-05-29", label: "Thứ 6 · 29.05", title: "DJ CÔNG MIO" },
  { date: "2026-05-30", label: "Thứ 7 · 30.05", title: "CA SĨ MOCHI" }
];

export const timeline = [
  { time: "22:00", title: "Múa cổ trang visual mãn nhãn" },
  { time: "22:10", title: "Xiếc nghệ thuật Đức Nghĩa - Thu Trang" },
  { time: "23:00", title: "Laser Man Nguyên Hồ" },
  { time: "24:00", title: "Sexy Show nóng bỏng từ team Dancer H CLUB" }
];

export const menuPages = Array.from({ length: 22 }, (_, index) => {
  const page = String(index + 1).padStart(2, "0");
  return {
    src: `/images/menu-new/menu-${page}.jpg`,
    alt: `Menu H Club trang ${page}`
  };
});

export const fallbackEvents = [
  {
    id: "fallback-1",
    slug: "holiday-vibes-dj-linh-kem",
    title: "Holiday Vibes · DJ Linh Kem",
    description: "Kỳ nghỉ chưa kết thúc, mood tiệc vẫn trên đà overheat cùng DJ LINH KEM.",
    date: "2026-05-01T22:00:00.000Z",
    location: "H Club Bãi Cháy, Hạ Long",
    ticketPrice: 0,
    totalTickets: 300,
    availableTickets: 300,
    status: "published",
    thumbnail: "/images/avata___1_.jpg"
  },
  {
    id: "fallback-2",
    slug: "hot-holiday-closing-dj-cukiu",
    title: "Hot Holiday Closing · DJ Cukiu",
    description: "DJ CUKIU chốt lễ với những track căng cực, hottrend và spotlight bùng nổ.",
    date: "2026-05-02T22:00:00.000Z",
    location: "H Club Bãi Cháy, Hạ Long",
    ticketPrice: 0,
    totalTickets: 300,
    availableTickets: 300,
    status: "published",
    thumbnail: "/images/avata___2_.jpg"
  },
  {
    id: "fallback-3",
    slug: "live-hits-night-quang-dang-tran",
    title: "Live Hits Night · Quang Đăng Trần",
    description: "Live vocal cảm xúc, giai điệu bắt tai và không khí bùng nổ tại H Club.",
    date: "2026-05-09T22:00:00.000Z",
    location: "H Club Bãi Cháy, Hạ Long",
    ticketPrice: 0,
    totalTickets: 300,
    availableTickets: 300,
    status: "published",
    thumbnail: "/images/banner_2.jpg"
  }
];

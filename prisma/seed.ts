import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { buildSlug } from "../lib/slug";

const prisma = new PrismaClient();

const eventSeed = [
  ["Holiday Vibes · DJ Linh Kem", "DJ LINH KEM tiếp tục giữ nhiệt kỳ nghỉ với một đêm nhạc trendy, bắt tai và dẫn mood cực dính.", "2026-05-01T22:00:00+07:00", "/images/avata___1_.jpg"],
  ["Hot Holiday Closing · DJ Cukiu", "DJ CUKIU chốt lễ với những track căng cực, hottrend và spotlight bùng nổ.", "2026-05-02T22:00:00+07:00", "/images/avata___2_.jpg"],
  ["Live Show Vibes · DJ Lin", "DJ LIN mang màu sắc hiện đại với set nhạc trendy, build mood khéo và năng lượng tăng dần.", "2026-05-08T22:00:00+07:00", "/images/banner.jpg"],
  ["Live Hits Night · Quang Đăng Trần", "Live vocal cảm xúc, giai điệu bắt tai và không khí bùng nổ cùng QUANG ĐĂNG TRẦN.", "2026-05-09T22:00:00+07:00", "/images/banner_2.jpg"],
  ["DJ Alexa · Live Show", "Một tối cuối tuần dành cho EDM hiện đại, beat chắc tay và năng lượng sân khấu tăng dần.", "2026-05-15T22:00:00+07:00", "/images/banner_1.jpg"],
  ["Exclusive Double Show", "MC GOKU + DJ BÁC SĨ HẢI trong show độc quyền với cao trào rõ và chất riêng.", "2026-05-16T22:00:00+07:00", "/images/poster_3.jpg"],
  ["DJ Hạnh Coca · Sweet Heat", "DJ HẠNH COCA lên lịch với vibe cuốn và nhịp nhạc đủ gắt để cả phòng cùng nhập cuộc.", "2026-05-22T22:00:00+07:00", "/images/banner_3.jpg"],
  ["DJ Minh Anh · Fresh Weekend", "DJ MINH ANH góp mặt với màu sắc hiện đại, fresh và năng động.", "2026-05-23T22:00:00+07:00", "/images/khong_gian_2.jpg"],
  ["DJ Công Mio · Peak Night", "DJ CÔNG MIO xuất hiện ngày 29.05, đẩy tuần cuối tháng lên nhiệt với beat dồn dập.", "2026-05-29T22:00:00+07:00", "/images/khong_gian_3.jpg"],
  ["Live Show Closing · Ca sĩ Mochi", "Ca sĩ MOCHI khép lại line-up tháng 5 với đêm closing chính thức.", "2026-05-30T22:00:00+07:00", "/images/hero-space.jpg"]
] as const;

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@hclub.vn";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "admin", passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
      role: "admin",
      profileInfo: JSON.stringify({ name: "H Club Admin" })
    }
  });

  for (const [title, description, date, thumbnail] of eventSeed) {
    const slug = buildSlug(title);
    await prisma.event.upsert({
      where: { slug },
      update: {
        title,
        description,
        date: new Date(date),
        location: "Tổ 7, Khu 4, Bãi Cháy, Hạ Long",
        ticketPrice: 0,
        totalTickets: 300,
        availableTickets: 300,
        status: "published",
        thumbnail
      },
      create: {
        title,
        slug,
        description,
        date: new Date(date),
        location: "Tổ 7, Khu 4, Bãi Cháy, Hạ Long",
        ticketPrice: 0,
        totalTickets: 300,
        availableTickets: 300,
        status: "published",
        thumbnail
      }
    });
  }

  await prisma.post.upsert({
    where: { slug: "h-club-live-show-may-2026" },
    update: {},
    create: {
      title: "H Club Live Show May 2026 chính thức lên lịch",
      slug: "h-club-live-show-may-2026",
      content: "<p>Tháng 5 này, H CLUB nâng cấp cuộc chơi với chuỗi live show âm nhạc xuyên tháng, hệ thống âm thanh ánh sáng công nghệ cao và những đêm diễn đặc biệt.</p>",
      thumbnail: "/images/hero-space.jpg",
      status: "published",
      authorId: admin.id
    }
  });

  console.log(`Seed completed. Admin: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { BookingSection } from "@/components/site/BookingSection";
import { DynamicEventsSection } from "@/components/site/DynamicEventsSection";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { LatestPostsSection } from "@/components/site/LatestPostsSection";
import { LiveShowOverview } from "@/components/site/LiveShowOverview";
import { MenuSection } from "@/components/site/MenuSection";
import { SpaceSection } from "@/components/site/SpaceSection";

export default function HomePage() {
  return (
    <div className="site-shell">
      <Header />
      <main>
        <Hero />
        <LiveShowOverview />
        <DynamicEventsSection />
        <MenuSection />
        <SpaceSection />
        <BookingSection />
        <LatestPostsSection />
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div>H Club Live Show · May 2026</div>
          <div>Tổ 7, Khu 4, Bãi Cháy, Hạ Long · Hotline 094.509.5555</div>
        </div>
      </footer>
    </div>
  );
}

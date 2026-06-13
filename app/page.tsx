import LatestProducts from "@/components/home/LatestProducts";
import Carousel from "../components/home/Carousel";
import TrustBadges from "../components/home/TrustBadges";
import BrandShowcase from "@/components/home/BrandShowcase";
import TiktokShowcase from "@/components/home/TiktokShowcase";
import KategoriShowcase from "@/components/home/KategoriShowcase";
import MilestoneSection from "@/components/home/MilestoneSection";

export default function Home() {
  return (
    <div className="main flex flex-col gap-y-4">
      <Carousel/>
      <div className="content px-16">
          <TrustBadges/>
          <MilestoneSection/>
          <LatestProducts/>
          <KategoriShowcase/>
          <BrandShowcase/>
          <TiktokShowcase/>
      </div>
    </div>
  );
}

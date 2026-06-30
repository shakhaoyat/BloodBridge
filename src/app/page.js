import Footer from "@/components/Footer";
import Navber from "@/components/Navber";
import Hero from "@/components/Hero";
import TotalFundsCard from "@/components/founding/TotalFundsCard";

export default function Home() {
  return (
    <div>
      <Navber />
      <Hero />
      <TotalFundsCard />
      <Footer />
    </div>

  );
}

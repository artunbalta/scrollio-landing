import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureGrid from "@/components/FeatureGrid";
import FAQ from "@/components/FAQ";
import WaitlistSection from "@/components/WaitlistSection";
import Footer from "@/components/Footer";
import SlidePreview from "@/components/SlidePreview";
import BackgroundOrbs from "@/components/BackgroundOrbs";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <BackgroundOrbs />
      <SlidePreview />
      <Navbar />
      <Hero />
      <FeatureGrid />
      <FAQ />
      <WaitlistSection />
      <Footer />
      </main>
  );
}

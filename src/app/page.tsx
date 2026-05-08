import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import FeaturedJobs from "@/components/home/FeaturedJobs";
import CategorySection from "@/components/home/CategorySection";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedCandidates from "@/components/home/FeaturedCandidates";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PlatformStats from "@/components/home/PlatformStats";
import BlogSection from "@/components/home/BlogSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedJobs />
      <CategorySection />
      <HowItWorks />
      <FeaturedCandidates />
      <TestimonialsSection />
      <PlatformStats />
      <BlogSection />
      <CTASection />
    </>
  );
}

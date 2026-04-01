import Navbar from "../components/layout/Navbar";
import DiscoverHero from "../components/discover/DiscoverHero";
import InteractiveMap from "../components/discover/InteractiveMap";
import QuizCarousel from "../components/discover/QuizCarousel";
import VisualInspiration from "../components/discover/VisualInspiration";
import LiveFacts from "../components/discover/LiveFacts";

export default function Discover() {
  return (
    <div className="bg-[#F8FBF3] min-h-screen">
      <Navbar />
      <div className="px-6 sm:px-14 pb-16 pt-6 max-w-[1920px] mx-auto space-y-2">
        <DiscoverHero />
        <InteractiveMap />
        <QuizCarousel />
        <LiveFacts />
        <VisualInspiration />
      </div>
    </div>
  );
}
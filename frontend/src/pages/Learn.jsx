import Navbar from "../components/layout/Navbar";
import LearnHero from "../components/learn/LearnHero";
import SpaceCarousel from "../components/learn/SpaceCarousel";
import CountriesCarousel from "../components/learn/CountriesCarousel";
import BooksCarousel from "../components/learn/BooksCarousel";
import DailyCards from "../components/learn/DailyCards";
import ScienceCarousel from "../components/learn/ScienceCarousel";

export default function Learn() {
  return (
    <div className="bg-[#F8FBF3] min-h-screen">
      <Navbar />
      <div className="px-6 sm:px-14 pb-16 space-y-10">
        <LearnHero />
        <DailyCards />
        <SpaceCarousel />
        <CountriesCarousel />
        <BooksCarousel />
        <ScienceCarousel />
      </div>
    </div>
  );
}
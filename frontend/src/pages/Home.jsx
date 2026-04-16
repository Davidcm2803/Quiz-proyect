import Navbar from "../components/layout/Navbar";
import Carousel from "../components/layout/Carousel";
import CarouselCategories from "../components/categories/CarouselCategories";

export default function Home() {
  return (
    <div className="bg-[#F8FBF3] min-h-screen">
      <Navbar />
      <div className="px-4 sm:px-8 lg:px-14 space-y-6 sm:space-y-8">
        <Carousel />
        <CarouselCategories />
      </div>
    </div>
  );
}
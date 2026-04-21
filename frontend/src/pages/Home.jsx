import Navbar from "../components/layout/Navbar";
import Carousel from "../components/layout/Carousel";
import CarouselMobile from "../components/layout/CarouselMobile";
import CarouselCategories from "../components/categories/CarouselCategories";

export default function Home() {
  return (
    <div className="bg-[#F8FBF3] min-h-screen">
      <Navbar />

      {/* Cada Carousel se muestra/oculta solo — sin wrappers con hidden */}
      <Carousel />         {/* hidden lg:block — solo desktop */}
      <CarouselMobile />   {/* lg:hidden      — solo mobile/tablet */}

      <div className="px-14 max-lg:px-4 space-y-8">
        <CarouselCategories />
      </div>
    </div>
  );
}
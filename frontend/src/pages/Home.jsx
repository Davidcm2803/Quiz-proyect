import Navbar from "../components/layout/Navbar";
import Carousel from "../components/layout/Carousel";

export default function Home() {
  return (
    <div className="bg-[#F8FBF3] min-h-screen">
      <Navbar />
      <div className="px-14">
        <Carousel />
      </div>
    </div>
  );
}
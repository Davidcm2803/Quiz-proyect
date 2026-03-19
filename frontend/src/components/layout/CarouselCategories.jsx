import scienceImg from "../../assets/categories/science.jpg";
import mathImg from "../../assets/categories/math.jpg";
import historyImg from "../../assets/categories/history.jpg";
import languageImg from "../../assets/categories/language.jpg";
import technologyImg from "../../assets/categories/technology.jpg";
import artImg from "../../assets/categories/art.jpg";

const CATEGORIES = [
  {
    id: 1,
    title: "Science",
    image: scienceImg,
  },
  {
    id: 2,
    title: "Mathematics",
    image: mathImg,
  },
  {
    id: 3,
    title: "History",  
    image: historyImg,
  },
  {
    id: 4,
    title: "Languages",
    image: languageImg,
  },
  {
    id: 5,
    title: "Technology",
    image: technologyImg,
  },
  {
    id: 6,
    title: "Art & Design",
    image: artImg,
  },
];

function CategoryCard({ title, image }) {
  return (
    <div className="relative overflow-hidden rounded-2xl h-52 shadow-md group cursor-pointer">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-black/30 flex items-end">
        <div className="p-4">
          <h3 className="text-white text-lg font-bold">{title}</h3>
        </div>
      </div>
    </div>
  );
}

export default function CarouselCategories() {
  return (
    <section className="py-6 w-full">
      <h2 className="text-2xl font-black text-gray-900 mb-4 text-left ml-14 mb-0">
        Explore categories
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 mr-14 ml-14">
        {CATEGORIES.map((category) => (
          <CategoryCard
            key={category.id}
            title={category.title}
            image={category.image}
          />
        ))}
      </div>
    </section>
  );
}
import CategoryCard from "./CategoryCard";

const CATEGORIES = [
  { id: 1, title: "Science" },
  { id: 2, title: "Mathematics" },
  { id: 3, title: "History" },
  { id: 4, title: "Languages" },
  { id: 5, title: "Technology" },
  { id: 6, title: "Art & Design" },
];

export default function CarouselCategories() {
  return (
    <section className="py-6 w-full">
      <h2 className="text-2xl font-black text-gray-900 mb-4 text-left ml-14">
        Explore categories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 mr-14 ml-14">
        {CATEGORIES.map((cat) => (
          <CategoryCard key={cat.id} title={cat.title} />
        ))}
      </div>
    </section>
  );
}
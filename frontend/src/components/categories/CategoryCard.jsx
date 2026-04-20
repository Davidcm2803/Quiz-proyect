import { useNavigate } from "react-router-dom";

const CATEGORY_IMAGES = {
  Science: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?q=80&w=1225&auto=format&fit=crop",
  Mathematics: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&q=80",
  History: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&q=80",
  Languages: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&q=80",
  Technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
  "Art & Design": "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80",
};

export default function CategoryCard({ title }) {
  const navigate = useNavigate();
  const image = CATEGORY_IMAGES[title];
  const slug = title.toLowerCase().replace(/\s+/g, "-").replace("&", "and");

  return (
    <div
      onClick={() => navigate(`/category/${slug}`)}
      className="relative overflow-hidden rounded-2xl h-28 sm:h-40 group cursor-pointer"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent flex items-end">
        <div className="p-3 sm:p-4">
          <h3 className="text-white text-sm sm:text-lg font-bold">{title}</h3>
        </div>
      </div>
    </div>
  );
}
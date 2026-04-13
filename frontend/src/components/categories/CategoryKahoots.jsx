import { useParams } from "react-router-dom";
import logo from "../../assets/logo.png";

const MOCK_KAHOOTS = [
  { id: 1, title: "Functions", questions: 10, tag: "Free" },
  { id: 2, title: "Algebraic equations", questions: 10, tag: "Free" },
  { id: 3, title: "First learners", questions: 10, tag: "Free" },
  { id: 4, title: "Machine Learning", questions: 10, tag: "Free" },
  { id: 5, title: "Statistics", questions: 10, tag: "Free" },
  { id: 6, title: "Numbers", questions: 10, tag: "Free" },
];

const CATEGORY_IMAGES = {
  science: "https://images.unsplash.com/photo-1532094349884-543290e4c3a9?w=1200&q=80",
  mathematics: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&q=80",
  history: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1200&q=80",
  languages: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&q=80",
  technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
  "art-and-design": "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=80",
};

function KahootCard({ rank, title, questions, tag }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-2xl font-black text-gray-800 w-8 text-center flex-shrink-0">
        {rank}
      </span>
      <div className="flex-1 flex items-stretch bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
        <div className="w-36 h-24 flex-shrink-0">
          <img
            src={`https://picsum.photos/seed/${title}/144/96`}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 px-6 py-3 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <img src={logo} alt="QHit" className="h-5 w-auto" />
            <span className="text-xs border-2 border-[#fde8e0] text-gray-800 font-bold px-3 py-0.5 rounded-full">
              {tag}
            </span>
          </div>
          <p className="font-semibold text-gray-800 text-sm text-left leading-snug">
            {title}
          </p>
          <p className="text-xs text-gray-400 text-right">
            {questions} questions
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CategoryKahoots() {
  const { slug } = useParams();
  const label = slug
    ?.replace(/-/g, " ")
    .replace(/\band\b/g, "&")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const bannerImg = CATEGORY_IMAGES[slug] || CATEGORY_IMAGES["mathematics"];

  return (
    <div className="bg-[#F8FBF3]">
      <div className="relative h-48 overflow-hidden">
        <img src={bannerImg} alt={label} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-white text-4xl font-black">{label}</h1>
        </div>
      </div>
      <div className="px-16 py-6">
        <h2 className="text-xl font-black text-gray-800 mb-5">Top Kahoots</h2>
        <div className="grid grid-cols-2 gap-x-12 gap-y-4">
          {MOCK_KAHOOTS.map((k, i) => (
            <KahootCard key={k.id} rank={i + 1} {...k} />
          ))}
        </div>
      </div>
    </div>
  );
}
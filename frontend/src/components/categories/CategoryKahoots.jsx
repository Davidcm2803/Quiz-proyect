import { useParams, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useDailyQuiz } from "../../hooks/useDailyQuizzes";

const CATEGORY_IMAGES = {
  science: "https://images.unsplash.com/photo-1532094349884-543290e4c3a9?w=1200&q=80",
  mathematics: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&q=80",
  history: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1200&q=80",
  languages: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&q=80",
  technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
  "art-and-design": "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=80",
};

const CATEGORY_QUESTION_IMAGES = {
  science: [
    "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=144&q=80",
    "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=144&q=80",
    "https://images.unsplash.com/photo-1564325724739-bae0bd08762c?w=144&q=80",
    "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=144&q=80",
    "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=144&q=80",
    "https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=144&q=80",
  ],
  mathematics: [
    "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=144&q=80",
    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=144&q=80",
    "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=144&q=80",
    "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=144&q=80",
    "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=144&q=80",
    "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=144&q=80",
  ],
  history: [
    "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=144&q=80",
    "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=144&q=80",
    "https://images.unsplash.com/photo-1548013146-72479768bada?w=144&q=80",
    "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=144&q=80",
    "https://images.unsplash.com/photo-1566159194957-58cf4c8d6d76?w=144&q=80",
    "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=144&q=80",
  ],
  languages: [
    "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=144&q=80",
    "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=144&q=80",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=144&q=80",
    "https://images.unsplash.com/photo-1491841651911-c44c30c34548?w=144&q=80",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=144&q=80",
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=144&q=80",
  ],
  technology: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=144&q=80",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=144&q=80",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=144&q=80",
    "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=144&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=144&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=144&q=80",
  ],
  "art-and-design": [
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=144&q=80",
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=144&q=80",
    "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=144&q=80",
    "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=144&q=80",
    "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=144&q=80",
    "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=144&q=80",
  ],
};

function QuizCard({ rank, question, slug, index, totalQuestions, quizTitle, navigate }) {
  const images = CATEGORY_QUESTION_IMAGES[slug] || CATEGORY_QUESTION_IMAGES["mathematics"];
  const img = images[index % images.length];

  return (
    <div className="flex items-center gap-4">
      <span className="text-2xl font-black text-gray-800 w-8 text-center flex-shrink-0">
        {rank}
      </span>
      <div
        onClick={() => navigate(`/student/daily-${slug}/Jugador`)}
        className="flex-1 flex items-stretch bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
      >
        <div className="w-36 h-24 flex-shrink-0">
          <img src={img} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 px-6 py-3 flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between">
            <img src={logo} alt="QHit" className="h-5 w-auto" />
            <span className="text-xs border-2 border-[#fde8e0] text-gray-800 font-bold px-3 py-0.5 rounded-full">
              IA
            </span>
          </div>
          <p className="font-semibold text-gray-800 text-sm text-left leading-snug line-clamp-2">
            {quizTitle}
          </p>
          <p className="text-xs text-gray-400 text-right">
            {totalQuestions} preguntas · {question.timeLimit}s
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CategoryKahoots() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { quiz, loading } = useDailyQuiz(slug);

  const label = slug
    ?.replace(/-/g, " ")
    .replace(/\band\b/g, "&")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const bannerImg = CATEGORY_IMAGES[slug] || CATEGORY_IMAGES["mathematics"];
  const visibleQuestions = quiz?.questions?.slice(0, 6) ?? [];

  return (
    <div className="bg-[#F8FBF3] pb-10">
      <div className="relative h-48 overflow-hidden">
        <img src={bannerImg} alt={label} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-white text-4xl font-black">{label}</h1>
        </div>
      </div>

      <div className="px-16 py-6">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-20">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-gray-300 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <p className="text-sm text-gray-400">Generando quiz del dia...</p>
          </div>
        ) : visibleQuestions.length > 0 ? (
          <>
            <h2 className="text-xl font-black text-gray-800 mb-5">Preguntas del dia</h2>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              {visibleQuestions.map((q, i) => (
                <QuizCard
                  key={i}
                  rank={i + 1}
                  question={q}
                  slug={slug}
                  index={i}
                  totalQuestions={quiz.questions.length}
                  quizTitle={quiz.title}
                  navigate={navigate}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white border border-gray-100 rounded-3xl p-6 text-center text-gray-400 text-sm">
            No se pudo cargar el quiz del dia. Intenta mas tarde.
          </div>
        )}
      </div>
    </div>
  );
}
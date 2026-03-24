import { useLibrary } from "../hooks/useLibrary";
import QuizCard from "../components/ui/QuizCard";

export default function Library() {
  const { quizzes, loading, error, deleteQuiz } = useLibrary();

  if (loading)
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100"
          >
            <div className="aspect-video bg-gray-100 animate-pulse" />
            <div className="px-3 py-2.5 space-y-1.5">
              <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
              <div className="h-2.5 bg-gray-100 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );

  if (error)
    return <p className="text-sm text-red-400 text-center py-10">{error}</p>;

  if (quizzes.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
          <span className="text-2xl">📂</span>
        </div>
        <p className="text-gray-400 text-sm">No tienes quizzes creados aún</p>
      </div>
    );

  return (
    <div>
      <h1 className="text-xl font-black text-gray-800 mb-5">Mi biblioteca</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {quizzes.map((quiz) => (
          <QuizCard
            key={quiz.id ?? quiz._id}
            quiz={quiz}
            onDelete={deleteQuiz}
          />
        ))}
      </div>
    </div>
  );
}

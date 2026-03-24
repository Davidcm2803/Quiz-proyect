import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import QuizNavbar from "../components/quiz/Quiznavbar";
import QuizEditor from "../components/quiz/QuizEditor";
import QuizMobileBar from "../components/quiz/QuizMobileBar";
import QuestionSidebar from "../components/quiz/Questionsidebar";
import QuizSidebar from "../components/quiz/Quizsidebar";
import { useQuizCreate } from "../hooks/useQuizCreate";
import { useQuizAI } from "../hooks/useQuizAI";
import Button from "../components/ui/Button";

export default function QuizAIGenerator() {
  const navigate = useNavigate();
  const quiz = useQuizCreate();
  const [prompt, setPrompt] = useState("");
  const [showEditor, setShowEditor] = useState(false);

  const { generateQuiz, generating, error } = useQuizAI({
    setTitle: quiz.setTitle,
    setQuestions: quiz.setQuestions,
    setActiveIndex: quiz.setActiveIndex,
  });

  const handleGenerate = async () => {
    await generateQuiz(prompt);
    setShowEditor(true);
  };
  if (showEditor) {
    return (
      <div className="h-screen flex flex-col overflow-hidden bg-[#f5f5f5]">
        <QuizNavbar
          title={quiz.title}
          onTitleChange={quiz.setTitle}
          onSave={quiz.saveQuiz}
          saving={quiz.saving}
        />
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:flex">
            <QuestionSidebar
              questions={quiz.questions}
              activeIndex={quiz.activeIndex}
              onSelect={quiz.setActiveIndex}
              onAdd={quiz.addQuestion}
              onDelete={quiz.deleteQuestion}
            />
          </div>
          <QuizEditor question={quiz.active} onUpdate={quiz.updateActive} />
          <div className="hidden md:flex">
            <QuizSidebar
              timeLimit={quiz.active.timeLimit}
              onTimeChange={(val) => quiz.updateActive("timeLimit", val)}
              answerType={quiz.active.answerType}
              onAnswerTypeChange={(val) => quiz.updateActive("answerType", val)}
            />
          </div>
        </div>
        <QuizMobileBar
          questions={quiz.questions}
          activeIndex={quiz.activeIndex}
          onSelect={quiz.setActiveIndex}
          onAdd={quiz.addQuestion}
          onDelete={quiz.deleteQuestion}
        />
      </div>
    );
  }

  return (
    <div className="bg-[#F8FBF3] min-h-screen flex flex-col">
      <nav className="bg-[#fde8e0] px-6 h-16 flex items-center justify-between z-50 gap-4">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-8 h-8 bg-[#16a34a] rounded-full flex items-center justify-center">
            <Sparkles size={16} color="white" />
          </div>
          <span className="font-black text-[#1a1a1a] text-lg">Quiz IA</span>
        </div>
        <Button variant="save" onClick={() => navigate("/")}>
          Cancelar
        </Button>
      </nav>
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-xl flex flex-col gap-6">
          <div className="text-center">
            <div className="w-14 h-14 bg-[#16a34a] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles size={28} color="white" />
            </div>
            <h1 className="text-3xl font-black text-[#1a1a1a]">
              Crear quiz con IA
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Describe el tema y la IA generará las preguntas. Podrás revisarlas
              y editarlas antes de guardar.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-gray-100 p-6 flex flex-col gap-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ej: Crea 5 preguntas sobre Ciencias para un nivel de Secundaria"
              rows={4}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#16a34a] transition-all resize-none placeholder:text-gray-300"
            />

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
              className="w-full bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generar quiz
                </>
              )}
            </button>
          </div>

          <p className="text-center text-gray-400 text-xs">
            El quiz se generará en el idioma del tema que escribas
          </p>
        </div>
      </div>
    </div>
  );
}

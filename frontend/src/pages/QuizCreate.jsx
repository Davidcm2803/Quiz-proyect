import { useParams } from "react-router-dom";
import QuizNavbar from "../components/quiz/Quiznavbar";
import QuizEditor from "../components/quiz/QuizEditor";
import QuizMobileBar from "../components/quiz/QuizMobileBar";
import QuestionSidebar from "../components/quiz/Questionsidebar";
import QuizSidebar from "../components/quiz/Quizsidebar";
import { useQuizCreate } from "../hooks/useQuizCreate";

export default function QuizCreate() {
  const { quizId } = useParams();
  const quiz = useQuizCreate(quizId);

  if (quiz.loading) return (
    <div className="h-screen flex items-center justify-center bg-[#f5f5f5]">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-[#5b4fe9] rounded-full animate-spin" />
    </div>
  );

  if (!quiz.active) return null;

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
        <div className="hidden md:flex flex-col overflow-y-auto">
          <QuizSidebar
            timeLimit={quiz.active.timeLimit}
            onTimeChange={(val) => quiz.updateActive("timeLimit", val)}
            answerType={quiz.active.answerType}
            onAnswerTypeChange={(val) => quiz.updateActive("answerType", val)}
            mode={quiz.mode}
            onModeChange={quiz.setMode}
            scheduledAt={quiz.scheduledAt}
            onScheduledAtChange={quiz.setScheduledAt}
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
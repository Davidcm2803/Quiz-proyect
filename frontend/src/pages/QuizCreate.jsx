import QuizNavbar from "../components/layout/Quiznavbar";
import QuizEditor from "../components/quiz/QuizEditor";
import QuizMobileBar from "../components/quiz/QuizMobileBar";
import QuestionSidebar from "../components/quiz/Questionsidebar";
import QuizSidebar from "../components/quiz/Quizsidebar";
import { useQuizCreate } from "../hooks/useQuizCreate";

export default function QuizCreate() {
  const quiz = useQuizCreate();

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
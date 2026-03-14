import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings2 } from "lucide-react";
import logo from "../assets/logo.png";
import Button from "../components/ui/Button";
import QuestionPlaceholder from "../components/quiz/Questionplaceholder";
import ImageUploader from "../components/quiz/Imageuploader";
import AnswerGrid from "../components/quiz/Answergrid";
import QuestionSidebar from "../components/quiz/Questionsidebar";
import QuizSidebar from "../components/quiz/Quizsidebar";
import { createQuestion, createAnswer, createQuiz, updateQuizQuestions } from "../database/database.js";

const emptyQuestion = () => ({
  question: "",
  image: null,
  answers: ["", "", "", ""],
  correct: null,
  timeLimit: 20,
  answerType: "single",
});

export default function QuizCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("Quiz title");
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const [saving,setSaving] = useState(false)
  const [code,setCode] = useState(null)

  const active = questions[activeIndex];

  const updateActive = (field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === activeIndex ? { ...q, [field]: value } : q)),
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, emptyQuestion()]);
    setActiveIndex(questions.length);
  };

  const deleteQuestion = (index) => {
    if (questions.length <= 1) return;
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
    setActiveIndex(Math.min(activeIndex, updated.length - 1));
  };

  function isValid(){

   if(!title || title.trim()==="") return false

   for(const q of questions){

    if(!q.question || q.question.trim()==="") return false

    const empty = q.answers.some(a=>!a || a.trim()==="")
    if(empty) return false

    if(q.correct===null) return false
   }

   return true
  }

  async function saveQuiz(){

   const confirmCreate = window.confirm(
    "¿Está seguro que desea crear este quiz?"
   )

   if(!confirmCreate) return

   setSaving(true)

   try{

    const res = await fetch("/quizzes",{
     method:"POST",
     headers:{
      "Content-Type":"application/json"
     },
     body:JSON.stringify({
       title,
       questions
     })
    })

    const data = await res.json()

    if(!res.ok){
     alert(data.detail)
     return
    }

    setCode(data.code)

   }catch(err){
    alert("Error al crear quiz")
   }

   setSaving(false)
  }
  const saveQuiz = async () => {
    try {
      const { id: quiz } = await createQuiz({
        title,
        description: "",
        creator: "6993cc6bc3012d94d9284d0d",
      });

      const questionIds = [];

      for (const q of questions) {
        const { id: questionId } = await createQuestion({
          quiz,                 
          text: q.question,
          points: 900,
          time: q.timeLimit,
        });

        questionIds.push(questionId);

        for (let i = 0; i < q.answers.length; i++) {
          await createAnswer({
            questionId,
            text: q.answers[i],         
            is_correct: Boolean(
              Array.isArray(q.correct)
                ? q.correct.includes(i)
                : q.correct === i
            ),
          });
        }
      }

      await updateQuizQuestions(quiz, questionIds);
      console.log("Quiz saved successfully:", quiz);

    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Failed to save quiz");
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#f5f5f5]">
      {/* Navbar */}
      <nav className="bg-[#fde8e0] px-4 md:px-6 h-16 flex items-center justify-between gap-2 md:gap-4 flex-shrink-0 z-50">
        <img
          src={logo}
          alt="QHit logo"
          className="h-16 md:h-20 w-auto object-contain cursor-pointer flex-shrink-0"
          onClick={() => navigate("/")}
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Quiz title"
          className="flex-1 min-w-0 max-w-xs bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-gray-300 transition-all"
        />
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Configuración solo en móvil */}
          <button
            onClick={() => setShowSettings((s) => !s)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600"
          >
            <Settings2 size={16} />
          </button>
          <Button variant="secondary" onClick={() => navigate("/")}>
            Exit
          </Button>

          <button
            disabled={!isValid() || saving}
            onClick={saveQuiz}
            className="bg-[#1a1a1a] hover:bg-[#333] text-white font-semibold text-sm px-4 md:px-6 py-2 rounded-lg transition-all active:scale-95 disabled:opacity-50"
          >

          <button className="bg-[#1a1a1a] hover:bg-[#333] text-white font-semibold text-sm px-4 md:px-6 py-2 rounded-lg transition-all active:scale-95" onClick={saveQuiz}>

            Save
          </button>
        </div>
      </nav>

      {code && (
        <div className="bg-green-100 text-green-800 p-3 text-center font-semibold">
          Quiz creado. Código: {code}
        </div>
      )}

      {/* Ajustes desplegables en móvil */}
      {showSettings && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-4 flex gap-4 z-40 shadow-md">
          <QuizSidebar
            timeLimit={active.timeLimit}
            onTimeChange={(val) => updateActive("timeLimit", val)}
            answerType={active.answerType}
            onAnswerTypeChange={(val) => updateActive("answerType", val)}
            inline
          />
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex">
          <QuestionSidebar
            questions={questions}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
            onAdd={addQuestion}
            onDelete={deleteQuestion}
          />
        </div>

        <div
          className="flex-1 overflow-y-auto flex flex-col"
          style={{
            backgroundImage: "url('/src/assets/classroom.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex flex-col h-full px-2 md:px-40 py-4 gap-2">
            <QuestionPlaceholder
              value={active.question}
              onChange={(val) => updateActive("question", val)}
            />

            <div className="w-full md:w-[500px] mx-auto h-[280px] rounded-2xl overflow-hidden flex-shrink-0 mt-10 mb-10">
              <ImageUploader
                image={active.image}
                onImageChange={(val) => updateActive("image", val)}
              />
            </div>

            <div className="flex flex-col justify-start mt-4 pb-6">
              <AnswerGrid
                answers={active.answers}
                onChange={(val) => updateActive("answers", val)}
                correct={active.correct}
                onCorrectChange={(val) => updateActive("correct", val)}
                answerType={active.answerType}
              />
            </div>
          </div>
        </div>

        <div className="hidden md:flex">
          <QuizSidebar
            timeLimit={active.timeLimit}
            onTimeChange={(val) => updateActive("timeLimit", val)}
            answerType={active.answerType}
            onAnswerTypeChange={(val) => updateActive("answerType", val)}
          />
        </div>
      </div>

      <div className="md:hidden bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 px-3 py-2 overflow-x-auto">
          {questions.map((q, i) => (
            <div key={i} className="relative flex-shrink-0">
              <button
                onClick={() => setActiveIndex(i)}
                className={`w-12 h-12 rounded-xl border-2 text-xs font-semibold transition-all overflow-hidden flex items-center justify-center
                  ${activeIndex === i ? "border-blue-500 bg-white shadow-md" : "border-gray-100 bg-gray-50"}`}
              >
                {q.image ? (
                  <img
                    src={q.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">{i + 1}</span>
                )}
              </button>
              {questions.length > 1 && (
                <button
                  onClick={() => deleteQuestion(i)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center shadow-sm"
                >
                  <span className="text-[10px] leading-none">×</span>
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addQuestion}
            className="flex-shrink-0 w-12 h-12 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-400 transition-all"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

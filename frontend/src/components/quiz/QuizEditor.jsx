import QuestionPlaceholder from "./Questionplaceholder";
import ImageUploader from "./Imageuploader";
import AnswerGrid from "./Answergrid";
import classroom from "../../assets/classroom.png";

export default function QuizEditor({ question, onUpdate }) {
  return (
    <div
      className="flex-1 overflow-y-auto flex flex-col"
      style={{
        backgroundImage: `url(${classroom})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col h-full px-2 md:px-40 py-4 gap-2">
        <QuestionPlaceholder
          value={question.question}
          onChange={(val) => onUpdate("question", val)}
        />
        <div className="w-full md:w-[500px] mx-auto h-50 rounded-2xl overflow-hidden flex-shrink-0 mt-15 mb-10">
          <ImageUploader
            image={question.image}
            onImageChange={(val) => onUpdate("image", val)}
          />
        </div>
        <div className="flex flex-col justify-start mt-4 pb-6">
          <AnswerGrid
            answers={question.answers}
            onChange={(val) => onUpdate("answers", val)}
            correct={question.correct}
            onCorrectChange={(val) => onUpdate("correct", val)}
            answerType={question.answerType}
          />
        </div>
      </div>
    </div>
  );
}
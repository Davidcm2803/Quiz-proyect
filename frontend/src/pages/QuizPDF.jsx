import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import Button from "../components/ui/Button";
import usePDFQuiz from "../hooks/usePDFQuiz";

export default function QuizPDF() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const { importFromPDF, importing, error } = usePDFQuiz({
    setTitle,
    setQuestions,
    setActiveIndex,
  });

  function handleFile(f) {
    if (f && f.type === "application/pdf") {
      setFile(f);
    } else {
      setFile(null);
    }
  }

  function handleGenerate() {
    if (!file) return;
    importFromPDF(file).then((res) => {
      if (!res) return;
      sessionStorage.setItem("pdfQuiz", JSON.stringify(res));
      navigate("/quiz/create");
    });
  }

  return (
    <div className="bg-[#F8FBF3] min-h-screen flex flex-col">
      <nav className="bg-[#fde8e0] px-6 h-16 flex items-center justify-between z-50 gap-4">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-8 h-8 bg-[#f43f5e] rounded-full flex items-center justify-center">
            <Sparkles size={16} color="white" />
          </div>
          <span className="font-black text-[#1a1a1a] text-lg">Quiz PDF</span>
        </div>
        <Button variant="save" onClick={() => navigate("/")}>
          Cancelar
        </Button>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-xl flex flex-col gap-6">

          <div className="text-center">
            <div className="w-14 h-14 bg-[#f43f5e] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles size={28} color="white" />
            </div>
            <h1 className="text-3xl font-black text-[#1a1a1a]">
              Crear quiz desde PDF
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Sube un PDF y la IA generará preguntas automáticamente
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-gray-100 p-6 flex flex-col gap-4">

            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                handleFile(e.dataTransfer.files[0]);
              }}
              onClick={() => document.getElementById("pdf-input").click()}
              className={`w-full border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center gap-3 ${
                dragging
                  ? "bg-red-50 border-[#f43f5e]"
                  : file
                  ? "bg-green-50 border-green-300"
                  : "bg-gray-50 border-gray-200 hover:border-[#f43f5e] hover:bg-red-50"
              }`}
            >
              <input
                id="pdf-input"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                file ? "bg-green-100" : "bg-gray-100"
              }`}>
                {file ? "✅" : "📄"}
              </div>
              {file ? (
                <div>
                  <p className="text-sm font-semibold text-gray-700">{file.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Click para cambiar archivo</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-gray-600">Arrastra tu PDF aquí</p>
                  <p className="text-xs text-gray-400 mt-0.5">o haz click para explorar archivos</p>
                </div>
              )}
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              onClick={handleGenerate}
              disabled={!file || importing}
              className="w-full bg-[#f43f5e] hover:bg-[#e11d48] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {importing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Procesando...
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
            El contenido del PDF se convertirá automáticamente en preguntas
          </p>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { X } from "lucide-react";

const ANSWER_CONFIG = [
  { color: "bg-[#e21b3c]", icon: "▲", label: "Answer 1" },
  { color: "bg-[#1368ce]", icon: "◆", label: "Answer 2" },
  { color: "bg-[#d89e00]", icon: "●", label: "Answer 3" },
  { color: "bg-[#26890c]", icon: "■", label: "Answer 4" },
];

// Modal para editar respuesta en móvil
function AnswerModal({ config, index, value, isCorrect, onSave, onClose }) {
  const [text, setText] = useState(value);
  const [correct, setCorrect] = useState(isCorrect);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white w-full rounded-t-3xl p-6 flex flex-col gap-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`${config.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
              <span className="text-white text-xl">{config.icon}</span>
            </div>
            <span className="font-semibold text-gray-700">{config.label}</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Input de respuesta */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tu respuesta..."
          autoFocus
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-gray-300 transition-all"
        />

        {/* Marcar como correcta */}
        <button
          onClick={() => setCorrect((c) => !c)}
          className={`w-full py-3 rounded-xl text-sm font-semibold transition-all border-2 flex items-center justify-center gap-2 ${
            correct ? "border-green-500 bg-green-50 text-green-600" : "border-gray-200 bg-gray-50 text-gray-500"
          }`}
        >
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${correct ? "border-green-500 bg-green-500" : "border-gray-300"}`}>
            {correct && (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          {correct ? "Respuesta correcta ✓" : "Marcar como correcta"}
        </button>

        {/* Guardar */}
        <button
          onClick={() => { onSave(text, correct); onClose(); }}
          className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold active:scale-95 transition-all"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

export default function AnswerGrid({ answers, onChange, correct, onCorrectChange, answerType }) {
  const [openModal, setOpenModal] = useState(null);

  // Verifica si es correcta
  const isCorrect = (i) => {
    if (answerType === "multiple") return Array.isArray(correct) && correct.includes(i);
    return correct === i;
  };

  // Maneja selección de correcta en desktop
  const handleCorrect = (i) => {
    if (answerType === "multiple") {
      const current = Array.isArray(correct) ? correct : [];
      onCorrectChange(current.includes(i) ? current.filter((c) => c !== i) : [...current, i]);
    } else {
      onCorrectChange(i);
    }
  };

  // Guarda datos del modal
  const handleModalSave = (index, text, isCorr) => {
    const updated = [...answers];
    updated[index] = text;
    onChange(updated);
    if (isCorr) {
      if (answerType === "multiple") {
        const current = Array.isArray(correct) ? correct : [];
        if (!current.includes(index)) onCorrectChange([...current, index]);
      } else {
        onCorrectChange(index);
      }
    } else {
      if (answerType === "multiple") {
        const current = Array.isArray(correct) ? correct : [];
        onCorrectChange(current.filter((c) => c !== index));
      } else {
        if (correct === index) onCorrectChange(null);
      }
    }
  };

  return (
    <>
      {/* Modal móvil */}
      {openModal !== null && (
        <AnswerModal
          config={ANSWER_CONFIG[openModal]}
          index={openModal}
          value={answers[openModal] || ""}
          isCorrect={isCorrect(openModal)}
          onSave={(text, isCorr) => handleModalSave(openModal, text, isCorr)}
          onClose={() => setOpenModal(null)}
        />
      )}

      <div className="grid grid-cols-2 gap-4 w-full">
        {ANSWER_CONFIG.map((config, i) => (
          <div key={i} className="flex items-stretch bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">

            {/* Bloque de color */}
            <div className={`${config.color} min-w-[56px] w-14 flex items-center justify-center flex-shrink-0`}>
              <span className="text-white text-2xl">{config.icon}</span>
            </div>

            {/* Input desktop */}
            <input
              type="text"
              value={answers[i] || ""}
              onChange={(e) => {
                const updated = [...answers];
                updated[i] = e.target.value;
                onChange(updated);
              }}
              placeholder={config.label}
              className="hidden md:block flex-1 min-w-0 px-5 py-5 text-base text-gray-600 outline-none placeholder:text-gray-400 bg-transparent font-medium"
            />

            {/* Tap móvil abre modal */}
            <button
              onClick={() => setOpenModal(i)}
              className="md:hidden flex-1 min-w-0 px-3 py-8 text-left text-sm outline-none bg-transparent font-medium truncate"
            >
              {answers[i] ? (
                <span className="text-gray-600">{answers[i]}</span>
              ) : (
                <span className="text-gray-400">{config.label}</span>
              )}
            </button>

            {/* Círculo correcto desktop */}
            <button
              onClick={() => handleCorrect(i)}
              className={`hidden md:flex mr-4 w-8 h-8 rounded-full border-2 items-center justify-center transition-all flex-shrink-0 self-center ${
                isCorrect(i) ? "border-green-500 bg-green-500" : "border-gray-300 hover:border-green-400"
              }`}
            >
              {isCorrect(i) && (
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            {/* Indicador correcto móvil */}
            <div className={`md:hidden mr-3 w-3 h-3 rounded-full self-center flex-shrink-0 ${isCorrect(i) ? "bg-green-500" : "bg-gray-200"}`} />
          </div>
        ))}
      </div>
    </>
  );
}
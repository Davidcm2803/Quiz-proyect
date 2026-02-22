import { useState, useRef } from "react";
import { ImagePlus, X } from "lucide-react";

export default function ImageUploader({ image, onImageChange }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    onImageChange(url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      onClick={() => !image && inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer transition-all border-2 border-dashed
        ${image ? "border-transparent" : dragging ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white/60 hover:bg-white/80"}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {image ? (
        <>
          <img src={image} alt="uploaded" className="w-full h-full object-cover" />
          <button
            onClick={(e) => { e.stopPropagation(); onImageChange(null); }}
            className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all"
          >
            <X size={14} />
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
            <ImagePlus size={22} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium">Add image</p>
        </div>
      )}
    </div>
  );
}
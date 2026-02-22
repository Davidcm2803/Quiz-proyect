const VARIANTS = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg",
  secondary: "bg-white text-gray-900 hover:bg-gray-50 shadow-sm",
  ghost: "bg-white bg-opacity-20 text-white hover:bg-opacity-30",

  // Botón de navbar: blanco
  nav: "bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200",

  // Botón Sign up: azul
  signup: "bg-[#4285F4] hover:bg-[#3367D6] text-white shadow-md hover:shadow-lg",
};

const SIZES = {
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-5 py-2",
  lg: "text-base px-6 py-2.5",

  nav:    "text-sm px-4 py-2",
  signup: "text-sm px-6 py-2",
};

export default function Button({
  children,
  variant = "primary",
  size,
  className = "",
  onClick,
  type = "button",
}) {
  // Si no se pasa size, usar el tamaño por defecto del variant cuando aplica
  const resolvedSize = size ?? (SIZES[variant] ? variant : "md");

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5
        font-semibold rounded-lg transition-all active:scale-95 select-none
        ${VARIANTS[variant]}
        ${SIZES[resolvedSize]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
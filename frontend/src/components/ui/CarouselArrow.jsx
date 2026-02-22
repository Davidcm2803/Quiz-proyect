import Button from "./Button";

export default function CarouselArrow({ children, onClick, className = "" }) {
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={onClick}
      className={`rounded-full w-10 h-10 p-0 flex items-center justify-center ${className}`}
    >
      {children}
    </Button>
  );
}
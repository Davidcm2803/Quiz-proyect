import { useMemo, useState, useEffect } from "react";
import img1 from "../../assets/images/1.png";
import img2 from "../../assets/images/2.png";
import img3 from "../../assets/images/3.png";
import img4 from "../../assets/images/4.png";
import img5 from "../../assets/images/5.png";
import img6 from "../../assets/images/6.png";
import img7 from "../../assets/images/7.png";

const IMAGES = [img1, img2, img3, img4, img5, img6, img7];

const DECORATIONS = [
  { src: img1, right: "6%",  top: "18%",    width: 130, animation: "float-1" },
  { src: img2, right: "16%", top: "28%",    width: 110, animation: "float-2" },
  { src: img3, right: "4%",  top: "40%",    width: 100, animation: "float-3" },
  { src: img4, right: "8%",  bottom: "6%",  width: 160, animation: "float-4" },
  { src: img5, left: "5%",   bottom: "32%", width: 110, animation: "float-2" },
  { src: img6, left: "14%",  bottom: "20%", width: 100, animation: "float-3" },
  { src: img7, left: "3%",   bottom: "45%", width: 95,  animation: "float-1" },
];

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 640);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

function DesktopDecorations() {
  return DECORATIONS.map((d, i) => {
    const hideOnMobile = i === 1 || i === 3 || i === 5;
    return (
      <img
        key={i}
        src={d.src}
        alt=""
        className={`floating-img ${d.animation} ${hideOnMobile ? "hidden sm:block" : ""}`}
        style={{
          top: d.top,
          bottom: d.bottom,
          left: d.left,
          right: d.right,
          width: d.width,
          animationDelay: `${i * 0.3}s`,
          filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.12))",
        }}
      />
    );
  });
}

function MobileDecorations() {
  const decorations = useMemo(() => {
    const zones = [
      { top: `${getRandom(5,  20)}%`, right: `${getRandom(2, 12)}%` },
      { top: `${getRandom(35, 52)}%`, right: `${getRandom(2, 12)}%` },
      { top: `${getRandom(5,  20)}%`, left:  `${getRandom(2, 12)}%` },
      { top: `${getRandom(55, 75)}%`, left:  `${getRandom(2, 12)}%` },
    ];

    const selected = [...IMAGES].sort(() => 0.5 - Math.random()).slice(0, 4);

    return selected.map((src, i) => ({
      src,
      animation: `float-${(i % 4) + 1}`,
      style: {
        ...zones[i],
        width: `${getRandom(75, 110)}px`,
      },
    }));
  }, []);

  return decorations.map((d, i) => (
    <img
      key={i}
      src={d.src}
      alt=""
      className={`floating-img ${d.animation}`}
      style={{
        ...d.style,
        animationDelay: `${i * 0.4}s`,
        filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.12))",
        opacity: 0.75,
      }}
    />
  ));
}

export default function FloatingDecorations() {
  const isMobile = useIsMobile();

  return (
    <>
      <style>{`
        @keyframes float-1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes float-2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes float-3 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes float-4 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }

        .floating-img {
          position: absolute;
          z-index: 1;
          opacity: 0.9;
          pointer-events: none;
          user-select: none;
        }
        .float-1 { animation: float-1 6s   ease-in-out infinite; }
        .float-2 { animation: float-2 7s   ease-in-out infinite; }
        .float-3 { animation: float-3 5.5s ease-in-out infinite; }
        .float-4 { animation: float-4 8s   ease-in-out infinite; }
      `}</style>

      {isMobile ? <MobileDecorations /> : <DesktopDecorations />}
    </>
  );
}
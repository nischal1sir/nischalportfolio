import { useState, useEffect } from 'react';
import img00 from '../../assets/imageonline/00.png';
import img10 from '../../assets/imageonline/10.png';
import img20 from '../../assets/imageonline/20.png';
import img30 from '../../assets/imageonline/30.png';
import img40 from '../../assets/imageonline/40.png';
import img50 from '../../assets/imageonline/50.png';
import img60 from '../../assets/imageonline/60.png';
import img70 from '../../assets/imageonline/70.png';
import img80 from '../../assets/imageonline/80.png';

const cellsData = [
  { img: img00, delayClass: 'd-0', alt: 'Stack 1' },
  { img: img10, delayClass: 'd-1', alt: 'Stack 2' },
  { img: img20, delayClass: 'd-2', alt: 'Stack 3' },
  { img: img30, delayClass: 'd-3', alt: 'Stack 4' },
  { img: img40, delayClass: 'd-4', alt: 'Stack 5' },
  { img: img50, delayClass: 'd-5', alt: 'Stack 6' },
  { img: img60, delayClass: 'd-6', alt: 'Stack 7' },
  { img: img70, delayClass: 'd-7', alt: 'Stack 8' },
  { img: img80, delayClass: 'd-8', alt: 'Stack 9' },
];

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[260px]">
      <style>{`
        .loader-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 6px;
          width: 220px;
          height: 220px;
        }

        @media (min-width: 640px) {
          .loader-grid {
            width: 280px;
            height: 280px;
            gap: 8px;
          }
        }

        @media (min-width: 1024px) {
          .loader-grid {
            width: 320px;
            height: 320px;
            gap: 10px;
          }
        }

        .loader-cell {
          width: 100%;
          height: 100%;
          background-color: #ffffff;
          border: 1px solid rgba(220, 220, 220, 0.8);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          box-sizing: border-box;
          border-radius: 8px;
          overflow: hidden;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: scale(0.6) translateY(18px);
          animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .loader-cell img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .loader-cell.d-0 { animation-delay: 0ms; }
        .loader-cell.d-1 { animation-delay: 140ms; }
        .loader-cell.d-2 { animation-delay: 280ms; }
        .loader-cell.d-3 { animation-delay: 420ms; }
        .loader-cell.d-4 { animation-delay: 560ms; }
        .loader-cell.d-5 { animation-delay: 700ms; }
        .loader-cell.d-6 { animation-delay: 840ms; }
        .loader-cell.d-7 { animation-delay: 980ms; }
        .loader-cell.d-8 { animation-delay: 1120ms; }

        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.6) translateY(18px);
          }
          70% {
            opacity: 1;
            transform: scale(1.06) translateY(-3px);
            box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }
        }
      `}</style>
      <div className="loader-grid">
        {cellsData.map((cell, idx) => (
          <div key={idx} className={`loader-cell ${cell.delayClass}`}>
            <img src={cell.img} alt={cell.alt} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * InitialSplashLoader Component
 * Shows a full-screen smooth loading splash screen when user enters/refreshes.
 */
export function InitialSplashLoader({ onComplete }: { onComplete?: () => void }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Fade out after all 9 boxes have finished revealing 1-by-1
    const timer = setTimeout(() => {
      setFading(true);
    }, 2200);

    const removeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2700);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <Loader />
      <div className="mt-8 text-center">
        <h2 className="text-[18px] sm:text-[20px] font-bold text-[#171717] tracking-tight mb-1">
          Nischal Rai
        </h2>
        <p className="text-[13px] sm:text-[14px] text-[#888888] font-mono tracking-wide">
          Loading Tech Stack...
        </p>
      </div>
    </div>
  );
}

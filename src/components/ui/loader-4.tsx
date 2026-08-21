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
  { img: img30, delayClass: 'd-1', alt: 'Stack 4' },
  { img: img40, delayClass: 'd-2', alt: 'Stack 5' },
  { img: img50, delayClass: 'd-2', alt: 'Stack 6' },
  { img: img60, delayClass: 'd-3', alt: 'Stack 7' },
  { img: img70, delayClass: 'd-3', alt: 'Stack 8' },
  { img: img80, delayClass: 'd-4', alt: 'Stack 9' },
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
          border: 1px solid rgba(230, 230, 230, 0.8);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          box-sizing: border-box;
          border-radius: 8px;
          overflow: hidden;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: 1.8s ripple ease-in-out infinite;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .loader-cell img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .loader-cell.d-1 {
          animation-delay: 140ms;
        }

        .loader-cell.d-2 {
          animation-delay: 280ms;
        }

        .loader-cell.d-3 {
          animation-delay: 420ms;
        }

        .loader-cell.d-4 {
          animation-delay: 560ms;
        }

        @keyframes ripple {
          0% {
            transform: scale(0.92);
            opacity: 0.4;
            filter: grayscale(60%);
            border-color: #ebebeb;
          }

          30% {
            transform: scale(1.05);
            opacity: 1;
            filter: grayscale(0%);
            border-color: #171717;
            box-shadow: 0 0 20px rgba(23, 23, 23, 0.3);
          }

          60% {
            transform: scale(0.92);
            opacity: 0.4;
            filter: grayscale(60%);
            border-color: #ebebeb;
          }

          100% {
            transform: scale(0.92);
            opacity: 0.4;
            filter: grayscale(60%);
            border-color: #ebebeb;
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
 * Shows a full-screen smooth loading splash screen when user visits for the first time.
 */
export function InitialSplashLoader({ onComplete }: { onComplete?: () => void }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
    }, 3400);

    const removeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3900);

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

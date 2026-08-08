import { useState } from 'react';
import { motion } from 'framer-motion';

interface CardArc7Props {
  images?: string[];
  angle?: number;
  gap?: number;
  yOffset?: number;
  duration?: number;
  hoverIntensity?: number;
  cardClassName?: string;
  className?: string;
}

export default function CardArc7({
  images = [],
  angle = 45,
  gap = 110,
  yOffset = 30,
  duration = 0.5,
  hoverIntensity = 1,
  cardClassName = 'bg-neutral-800',
  className = ''
}: CardArc7Props) {
  const [isOpen, setIsOpen] = useState(false);
  const cards = [0, 1, 2, 3, 4, 5, 6];
  const center = 3;

  return (
    <div 
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(prev => !prev)}
      className={`relative w-[10rem] h-[13rem] sm:w-[12rem] sm:h-[15rem] cursor-pointer flex items-center justify-center ${className}`}
    >
      {cards.map((i) => {
        const dist = i - center;
        const targetRotate = isOpen ? dist * (angle / center) * hoverIntensity : 0;
        const targetX = isOpen ? dist * (gap / center) * hoverIntensity : 0;
        
        let targetY = 0;
        if (isOpen) {
          if (Math.abs(dist) === 3) targetY = yOffset;
          else if (Math.abs(dist) === 2) targetY = 0.33 * yOffset;
          else if (Math.abs(dist) === 1) targetY = -0.17 * yOffset;
          else targetY = -0.5 * yOffset;
          targetY = targetY * hoverIntensity;
        }

        const img = images[i];

        return (
          <motion.div
            key={i}
            animate={{
              rotate: targetRotate,
              x: targetX,
              y: targetY,
              scale: isOpen ? (dist === 0 ? 1.05 : 1) : 1
            }}
            transition={{
              type: 'spring',
              stiffness: 180,
              damping: 20,
              mass: 0.8,
              duration
            }}
            style={{
              zIndex: 4 - Math.abs(dist),
              originX: 0.5,
              originY: 1
            }}
            className={`absolute inset-0 rounded-2xl shadow-[0_4px_10px_-2px_rgba(0,0,0,0.15)] border border-white/5 overflow-hidden ${
              img ? '' : cardClassName
            }`}
          >
            {img && (
              <img
                src={img}
                alt={`Card ${i + 1}`}
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Check } from 'lucide-react';

interface MorphButtonProps {
  href?: string;
  download?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function MorphButton({
  href,
  download,
  children = 'Download',
  className = '',
}: MorphButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const Tag = href ? motion.a : motion.button;

  return (
    <Tag
      href={href}
      download={download}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className={`relative inline-flex items-center justify-center gap-3 border-2 border-[#0a0a0a] px-8 py-3.5 sm:px-10 sm:py-4 text-[12px] sm:text-[13px] tracking-[0.15em] uppercase font-semibold text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white transition-colors duration-300 cursor-pointer ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
        <AnimatePresence mode="popLayout" initial={false}>
          {!isHovered ? (
            <motion.div
              key="download"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 600, damping: 25 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Download className="w-4 h-4" />
            </motion.div>
          ) : (
            <motion.div
              key="check"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 600, damping: 25 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Check className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span>{children}</span>
    </Tag>
  );
}
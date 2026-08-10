import { memo } from 'react';

const Footer = () => {
  return (
    <>
    {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-5 text-center text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-[#888]">
        <span>&copy; 2026 Nischal Rai</span>
      </footer>
    </>
  );
};

export default memo(Footer);
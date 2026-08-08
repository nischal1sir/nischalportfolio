import { memo } from 'react';

const Header = () => {
  return (
    <>
    {/* Header*/}
      <header className="relative z-50 flex items-center justify-between px-5 py-4 text-[10px] tracking-[0.12em] uppercase text-[#111]">
        <span className="font-medium">Nischal Rai'</span>
        <span className="font-medium hidden sm:inline">folio</span>
        <span className="font-medium">@ yoyo hello | bitch</span>
      </header>
    </>
  );
};

export default memo(Header);
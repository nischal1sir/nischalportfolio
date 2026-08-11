import { useState } from 'react';
import { Link } from 'react-router-dom';

const navLinks = [
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Tech', to: '/tech' },
  { label: 'Exp', to: '/experience' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        .font-poppins { font-family: 'Poppins', sans-serif; }
      `}</style>

      {/* Main Navbar */}
      <nav className="font-poppins relative z-50 flex items-center justify-between px-5 sm:px-8 md:px-12 lg:px-16 py-4 sm:py-5 text-[11px] sm:text-[12px] md:text-[13px] tracking-[0.08em] uppercase text-[#111]">
        
        {/* Logo */}
        <Link to="/" className="font-semibold hover:opacity-60 transition-opacity duration-300">
          Nischal Rai'
        </Link>

        {/* Desktop Center Links */}
        <div className="hidden sm:flex items-center gap-6 md:gap-10 lg:gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="font-medium hover:opacity-60 transition-opacity duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Right */}
        <div className="hidden sm:flex items-center gap-4 md:gap-6">
          <Link to="/connect" className="font-medium hover:opacity-60 transition-opacity duration-300">
            Connect
          </Link>
          <Link
            to="/resume"
            className="font-medium border border-[#111] px-3 py-1.5 md:px-4 md:py-2 hover:bg-[#111] hover:text-white transition-all duration-300"
          >
            Resume
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`w-5 h-[1.5px] bg-[#111] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
          <span className={`w-5 h-[1.5px] bg-[#111] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-[1.5px] bg-[#111] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div
        className={`font-poppins sm:hidden fixed inset-0 z-40 bg-[#f4f4f4] flex flex-col items-center justify-center gap-8 transition-all duration-500 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            onClick={() => setMenuOpen(false)}
            className="text-[18px] tracking-[0.1em] uppercase font-medium hover:opacity-60 transition-opacity"
          >
            {link.label}
          </Link>
        ))}
        <Link
          to="/connect"
          onClick={() => setMenuOpen(false)}
          className="text-[18px] tracking-[0.1em] uppercase font-medium hover:opacity-60 transition-opacity"
        >
          Connect
        </Link>
        <Link
          to="/resume"
          onClick={() => setMenuOpen(false)}
          className="mt-4 font-medium border border-[#111] px-6 py-2.5 text-[14px] tracking-[0.1em] uppercase hover:bg-[#111] hover:text-white transition-all duration-300"
        >
          Resume
        </Link>
      </div>
    </>
  );
}
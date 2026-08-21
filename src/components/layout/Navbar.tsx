import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProfile, useNavLinks, useSocials } from '../../hooks/usePortfolioData';
import { socialIconLib, MenuIcon, XIcon, MailIcon, FileTextIcon } from '../ui/Icon';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { profile } = useProfile();
  const { navLinks } = useNavLinks();
  const { socials } = useSocials();

  const mainNav = navLinks.filter(n => !n.is_contact);
  const contactNav = navLinks.find(n => n.is_contact) || { label: "Let's Talk", to: "/contact" };

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <>
      <header className="lg:hidden sticky top-0 z-[60] flex items-center justify-between px-4 h-14 bg-[#fafafa]/90 backdrop-blur border-b border-[#ebebeb]">
        <Link to="/" className="font-semibold text-[14px] tracking-[-0.01em] text-[#171717]">
          {profile?.name || 'Nischal Rai'}
          <span className="text-[#0070f3]">.</span>
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[#ebebeb] bg-white text-[#171717]"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <XIcon size={18} /> : <MenuIcon size={18} />}
        </button>
      </header>

      <div
        id="mobile-nav"
        className={`lg:hidden fixed inset-0 top-14 z-50 bg-[#fafafa] transition-all duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!open}
      >
        <nav className="flex flex-col gap-1 p-4 pt-6">
          {mainNav.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center justify-between py-3 px-4 rounded-lg text-[16px] font-medium transition-colors ${
                isActive(link.to)
                  ? 'bg-[#171717] text-white'
                  : 'text-[#171717] hover:bg-[#ebebeb]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to={contactNav.to}
            className={`flex items-center justify-between py-3 px-4 rounded-lg text-[16px] font-medium transition-colors ${
              isActive(contactNav.to)
                ? 'bg-[#171717] text-white'
                : 'text-[#171717] hover:bg-[#ebebeb]'
            }`}
          >
            {contactNav.label}
          </Link>

          <div className="mt-6 pt-6 border-t border-[#ebebeb]">
            <Link
              to="/resume"
              className="inline-flex items-center gap-2 text-[14px] font-medium text-[#0070f3] px-2"
            >
              <FileTextIcon size={16} />
              Download CV
            </Link>
            <p className="mt-4 px-2 text-[11px] uppercase tracking-[0.12em] text-[#888888]">
              Find me online
            </p>
            <div className="flex items-center gap-2 mt-3 px-2">
              {socials.map((s) => {
                const Icon = socialIconLib[s.icon];
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#ebebeb] text-[#888888] hover:bg-[#171717] hover:text-white hover:border-[#171717] transition-colors"
                  >
                    {Icon ? <Icon size={16} /> : null}
                  </a>
                );
              })}
            </div>
          </div>
        </nav>
      </div>

      <span className="sr-only">
        <MailIcon size={20} />
      </span>
    </>
  );
}

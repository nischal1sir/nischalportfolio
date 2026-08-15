import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import photo from '../../assets/profile.jpg';

const navLinks = [
  { label: 'Home', to: '/', icon: 'home' },
  { label: 'About', to: '/about', icon: 'user' },
  { label: 'Projects', to: '/projects', icon: 'folder' },
  { label: 'Tech', to: '/tech', icon: 'code' },
  { label: 'Experience', to: '/experiences', icon: 'briefcase' },
];

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com/', icon: 'instagram' },
  { label: 'X', href: 'https://x.com/', icon: 'x' },
  { label: 'GitHub', href: 'https://github.com/', icon: 'github' },
  { label: 'LinkedIn', href: 'https://linkedin.com/', icon: 'linkedin' },
];

const icons: Record<string, React.ReactElement> = {
  home: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  user: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  folder: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  code: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  briefcase: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  mail: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  'file-text': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  x: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  github: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  linkedin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 11 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
};

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile hamburger button - ONLY visible when sidebar is CLOSED */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-60 p-2 bg-white border border-[#ebebeb] rounded-lg"
          aria-label="Open menu"
          aria-expanded="false"
        >
          <span className="block w-6 h-[2px] bg-[#171717] transition-all duration-300" />
          <span className="block w-6 h-[2px] bg-[#171717] transition-all duration-300 mt-1.5" />
          <span className="block w-6 h-[2px] bg-[#171717] transition-all duration-300 mt-1.5" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-[200px] bg-[#fafafa] border-r border-[#ebebeb] z-50 flex flex-col transition-all duration-300 lg:translate-x-0 overflow-y-auto ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Main navigation"
        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
      >
        {/* Profile Section */}
        <div className="flex flex-col items-center pt-6 pb-5 px-4 border-b border-[#ebebeb]">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#ebebeb] shadow-sm mb-3">
            <img src={photo} alt="Nischal Rai" className="w-full h-full object-cover" />
          </div>
          <p className="font-semibold text-[14px] tracking-[0.02em] text-[#171717] leading-tight">Nischal Rai</p>
          <p className="text-[10px] text-[#888888] mt-1 tracking-[0.05em]">Developer / Designer</p>
          <Link
            to="/resume"
            onClick={() => setMobileOpen(false)}
            className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#171717] text-white text-[10px] font-medium tracking-[0.1em] uppercase hover:opacity-80 transition-opacity"
          >
            <span className="flex-shrink-0">{icons['file-text']}</span>
            <span>Resume</span>
          </Link>
        </div>

        {/* Main navigation links */}
        <nav className="py-3 px-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#171717] text-white'
                    : 'text-[#4d4d4d] hover:bg-[#ebebeb] hover:text-[#171717]'
                }`}
                aria-current={isActive ? 'page' : undefined}
                style={{ fontWeight: 500, letterSpacing: '0.05em' }}
              >
                <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-[#888888]'}`}>
                  {icons[link.icon]}
                </span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Let's Talk + Social media icons */}
        <div className="px-3 pb-4 pt-2">
          <Link
            to="/connect"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] font-medium text-[#4d4d4d] hover:bg-[#ebebeb] hover:text-[#171717] transition-all duration-200 border border-[#ebebeb]"
            style={{ fontWeight: 500, letterSpacing: '0.05em' }}
          >
            <span className="flex-shrink-0 text-[#888888]">{icons.mail}</span>
            <span>Let&rsquo;s Talk</span>
          </Link>

          <div className="flex items-center justify-center gap-2 mt-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-7 h-7 flex items-center justify-center rounded-full border border-[#ebebeb] text-[#888888] hover:bg-[#171717] hover:text-white hover:border-[#171717] transition-all duration-200"
              >
                {icons[social.icon]}
              </a>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          aria-hidden="true"
        />
      )}
    </>
  );
}
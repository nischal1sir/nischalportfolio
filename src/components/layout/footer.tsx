import { Link } from 'react-router-dom';
import { profile } from '../../data/profile';
import { navLinks, contactNav } from '../../data/nav';
import { socials } from '../../data/socials';
import { socialIconLib } from '../ui/Icon';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-[#ebebeb] bg-[#fafafa] lg:hidden">
      <div className="px-5 sm:px-8 md:px-12 py-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="font-semibold text-[15px] text-[#171717] mb-2">
              {profile.name}
              <span className="text-[#0070f3]">.</span>
            </p>
            <p className="text-[13px] leading-relaxed text-[#4d4d4d] max-w-xs">
              Building, learning and growing one project at a time.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#888888] mb-3">
              Navigate
            </p>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[13px] text-[#4d4d4d] hover:text-[#171717] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={contactNav.to}
                  className="text-[13px] text-[#4d4d4d] hover:text-[#171717] transition-colors"
                >
                  {contactNav.label}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#888888] mb-3">
              Connect
            </p>
            <div className="flex items-center gap-2">
              {socials.map((s) => {
                const Icon = socialIconLib[s.icon];
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[#ebebeb] text-[#888888] hover:bg-[#171717] hover:text-white hover:border-[#171717] transition-colors"
                  >
                    {Icon ? <Icon size={15} /> : null}
                  </a>
                );
              })}
            </div>
            <p className="mt-4 text-[11px] text-[#888888]">
              Based in {profile.location}
            </p>
          </div>
        </div>

        <div className="mt-10 pt-5 border-t border-[#ebebeb] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-[11px] tracking-[0.05em] text-[#888888]">
            © {year} {profile.name}. All rights reserved.
          </p>
          <p className="text-[11px] tracking-[0.05em] text-[#888888]">
            Built with React, TypeScript & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}

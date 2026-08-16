import { Link, useLocation } from 'react-router-dom';
import photo from '../../assets/profile.jpg';
import { profile } from '../../data/profile';
import { navLinks, contactNav } from '../../data/nav';
import { socials } from '../../data/socials';
import {
  socialIconLib,
  navIconLib,
  FileTextIcon,
} from '../ui/Icon';

export default function Sidebar() {
  const location = useLocation();
  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <aside
      className="hidden lg:flex fixed left-0 top-0 h-full w-[220px] flex-col bg-[#fafafa] border-r border-[#ebebeb] z-50 overflow-y-auto"
      aria-label="Primary"
    >
      <div className="flex flex-col items-center pt-6 pb-5 px-4 border-b border-[#ebebeb]">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#ebebeb] shadow-sm mb-3">
          <img src={photo} alt="Nischal Rai" className="w-full h-full object-cover" />
        </div>
        <p className="font-semibold text-[14px] tracking-[0.02em] text-[#171717] leading-tight">
          {profile.name}
        </p>
        <p className="text-[10px] text-[#888888] mt-1 tracking-[0.05em]">
          {profile.role}
        </p>
        <Link
          to="/resume"
          className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#171717] text-white text-[10px] font-medium tracking-[0.1em] uppercase hover:opacity-80 transition-opacity"
        >
          <FileTextIcon size={14} />
          <span>Resume</span>
        </Link>
      </div>

      <nav className="py-3 px-3 space-y-1">
        {navLinks.map((link) => {
          const Icon = navIconLib[link.icon];
          const active = isActive(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium tracking-[0.02em] transition-all duration-200 ${
                active
                  ? 'bg-[#171717] text-white'
                  : 'text-[#4d4d4d] hover:bg-[#ebebeb] hover:text-[#171717]'
              }`}
              style={{ fontWeight: 500, letterSpacing: '0.03em' }}
              aria-current={active ? 'page' : undefined}
            >
              <span className={`flex-shrink-0 ${active ? 'text-white' : 'text-[#888888]'}`}>
                {Icon ? <Icon size={18} /> : null}
              </span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4 pt-2 mt-auto">
        <Link
          to={contactNav.to}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 border ${
            isActive(contactNav.to)
              ? 'bg-[#171717] text-white border-[#171717]'
              : 'text-[#4d4d4d] border-[#ebebeb] hover:bg-[#ebebeb] hover:text-[#171717]'
          }`}
          style={{ fontWeight: 500 }}
          aria-current={isActive(contactNav.to) ? 'page' : undefined}
        >
          <span
            className={`flex-shrink-0 ${
              isActive(contactNav.to) ? 'text-white' : 'text-[#888888]'
            }`}
          >
          </span>
          <span>{contactNav.label}</span>
        </Link>

        <div className="flex items-center justify-center gap-2 mt-3">
          {socials.map((social) => {
            const Icon = socialIconLib[social.icon];
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-[#ebebeb] text-[#888888] hover:bg-[#171717] hover:text-white hover:border-[#171717] transition-colors"
              >
                {Icon ? <Icon size={15} /> : null}
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

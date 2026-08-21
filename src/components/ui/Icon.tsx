import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(size = 20): SVGProps<SVGSVGElement> {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };
}

export function HomeIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function UserIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function FolderIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function CodeIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export function BriefcaseIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

export function MailIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

export function FileTextIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

export function ArrowRightIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function DownloadIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function ChevronDownIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function MenuIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function XIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function ExternalLinkIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export function BookOpenIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

export function ShuffleIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  );
}

export function HammerIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M15 12l-8.5 8.5a2.12 2.12 0 0 1-3-3L12 9" />
      <path d="M17.64 15 22 10.64" />
      <path d="m20.64 16.64-7.5-7.5a2 2 0 0 1 0-2.83l3.18-3.18a2 2 0 0 1 2.83 0l4.74 4.74a2 2 0 0 1 0 2.83L19.82 16a2 2 0 0 1-2.83 0z" />
      <line x1="14" y1="6" x2="20" y2="12" />
    </svg>
  );
}

export function WrenchIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

export function GithubIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} fill="currentColor" stroke="none" {...rest}>
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export function LinkedinIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} fill="currentColor" stroke="none" {...rest}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function XSocialIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} fill="currentColor" stroke="none" {...rest}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function InstagramIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function LayoutIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="3" y1="9" x2="21" y2="9" />
    </svg>
  );
}

export function DatabaseIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

export function RefreshCwIcon({ size, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

export const serviceIconLib: Record<string, (p: IconProps) => React.ReactElement> = {
  layout: LayoutIcon,
  briefcase: BriefcaseIcon,
  user: UserIcon,
  code: CodeIcon,
  database: DatabaseIcon,
  'refresh-cw': RefreshCwIcon,
};

export const philosophyIconLib: Record<string, (p: IconProps) => React.ReactElement> = {
  'book-open': BookOpenIcon,
  shuffle: ShuffleIcon,
  hammer: HammerIcon,
  wrench: WrenchIcon,
};

export const socialIconLib: Record<string, (p: IconProps) => React.ReactElement> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  x: XSocialIcon,
  twitter: XSocialIcon,
  instagram: InstagramIcon,
  mail: MailIcon,
  code: CodeIcon,
  'file-text': FileTextIcon,
  'external-link': ExternalLinkIcon,
};

export const navIconLib: Record<string, (p: IconProps) => React.ReactElement> = {
  home: HomeIcon,
  user: UserIcon,
  'user-check': UserIcon,
  folder: FolderIcon,
  code: CodeIcon,
  briefcase: BriefcaseIcon,
  'file-text': FileTextIcon,
  mail: MailIcon,
};

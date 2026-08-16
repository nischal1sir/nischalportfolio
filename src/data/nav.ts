export interface NavLink {
  label: string;
  to: string;
  icon: string;
}

export const navLinks: NavLink[] = [
  { label: 'Home', to: '/', icon: 'home' },
  { label: 'About', to: '/about', icon: 'user' },
  { label: 'Skills', to: '/skills', icon: 'code' },
  { label: 'Projects', to: '/projects', icon: 'folder' },
  { label: 'Experience', to: '/experience', icon: 'briefcase' },
];

export const contactNav: NavLink = { label: "Let's Talk", to: '/contact', icon: 'mail' };

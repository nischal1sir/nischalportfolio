import { useAdmin } from './AdminContext';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Menu, LogOut, LayoutDashboard, User, Code, FolderKanban,
  Briefcase, GraduationCap, Wrench, Share2, Image, HelpCircle,
  List, ChevronLeft, ChevronRight, X,
} from 'lucide-react';

const adminNavItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/profile', label: 'Profile', icon: User },
  { path: '/admin/skills', label: 'Skills', icon: Code },
  { path: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { path: '/admin/experience', label: 'Experience', icon: Briefcase },
  { path: '/admin/education', label: 'Education', icon: GraduationCap },
  { path: '/admin/services', label: 'Services', icon: Wrench },
  { path: '/admin/socials', label: 'Socials', icon: Share2 },
  { path: '/admin/gallery', label: 'Gallery', icon: Image },
  { path: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { path: '/admin/nav', label: 'Navigation', icon: List },
];

export default function AdminLayout() {
  const { isAuthenticated, logout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Auto-close mobile sidebar on navigation
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/admin/login') {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, location, navigate]);

  if (!isAuthenticated && location.pathname !== '/admin/login') {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Sidebar ─────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Header */}
        <div className="flex items-center h-14 sm:h-16 px-3 border-b border-gray-200 flex-shrink-0 gap-2">
          {!sidebarCollapsed && (
            <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate flex-1">Admin Panel</h1>
          )}
          <div className={`flex items-center gap-1 ${sidebarCollapsed ? 'w-full justify-center' : 'ml-auto'}`}>
            {/* Mobile close */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
            {/* Desktop collapse */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex items-center justify-center p-1.5 text-gray-400 hover:text-gray-700 rounded-md hover:bg-gray-100"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Nav links */}
        <nav
          className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto"
          role="navigation"
          aria-label="Admin navigation"
        >
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            title={sidebarCollapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            {!sidebarCollapsed && <span className="truncate">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────── */}
      <div className={`min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 md:px-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <span className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                Admin Dashboard
              </span>
            </div>
            <span className="text-xs sm:text-sm text-gray-400 hidden sm:block">
              Logged in as admin
            </span>
          </div>
        </header>

        <main className="p-3 sm:p-4 md:p-6 lg:p-8" role="main">
          <Outlet />
        </main>
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
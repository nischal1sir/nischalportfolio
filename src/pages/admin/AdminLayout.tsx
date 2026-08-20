import { useAdmin } from './AdminContext';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { Menu, LogOut, LayoutDashboard, User, Code, FolderKanban, Briefcase, GraduationCap, Wrench, Share2, Image, HelpCircle, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

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

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/admin/login') {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, location, navigate]);

  if (!isAuthenticated && location.pathname !== '/admin/login') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-3 sm:px-4 border-b border-gray-200">
            {!sidebarCollapsed && (
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Admin Panel</h1>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 text-gray-500 hover:text-gray-700 flex-shrink-0"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          <nav className="flex-1 px-2 sm:px-3 py-3 space-y-1 overflow-y-auto" role="navigation" aria-label="Admin navigation">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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

          <div className="p-2 sm:p-3 border-t border-gray-200">
            <button
              onClick={logout}
              className={`flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors w-full ${
                sidebarCollapsed ? 'justify-center' : ''
              }`}
              title={sidebarCollapsed ? 'Logout' : undefined}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              {!sidebarCollapsed && <span className="truncate">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      <div className={`lg:ml-64 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : ''}`}>
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 md:px-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Logged in as admin
              </span>
            </div>
          </div>
        </header>

        <main className="p-3 sm:p-4 md:p-6 lg:p-8" role="main">
          <Outlet />
        </main>
      </div>

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
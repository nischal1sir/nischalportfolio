import { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { Link, useLocation } from 'react-router-dom';
import {
  User, Code, FolderKanban, Briefcase, GraduationCap,
  Wrench, Share2, Image, HelpCircle, List, ArrowUpRight,
  TrendingUp, Loader2
} from 'lucide-react';
import {
  profileApi, skillsApi, projectsApi, experiencesApi,
  educationApi, servicesApi, socialsApi, galleryApi,
  faqsApi, navApi
} from '../../services/adminApi';
import type { Profile, Project } from '../../types';

export default function AdminDashboard() {
  const { isAuthenticated } = useAdmin();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<Partial<Profile>>({});
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [counts, setCounts] = useState({
    profile: 1,
    skills: 0,
    projects: 0,
    experience: 0,
    education: 0,
    services: 0,
    socials: 0,
    gallery: 0,
    faqs: 0,
    nav: 0,
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
    }
  }, [isAuthenticated]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [
        prof, sks, prjs, exps, edu, srv, soc, gal, faq, nav
      ] = await Promise.allSettled([
        profileApi.get(),
        skillsApi.getAll(),
        projectsApi.getAll(),
        experiencesApi.getAll(),
        educationApi.getAll(),
        servicesApi.getAll(),
        socialsApi.getAll(),
        galleryApi.getAll(),
        faqsApi.getAll(),
        navApi.getAll(),
      ]);

      const profRes = prof.status === 'fulfilled' ? prof.value : {};
      const sksRes = sks.status === 'fulfilled' ? sks.value : [];
      const prjsRes = prjs.status === 'fulfilled' ? prjs.value : [];
      const expsRes = exps.status === 'fulfilled' ? exps.value : [];
      const eduRes = edu.status === 'fulfilled' ? edu.value : [];
      const srvRes = srv.status === 'fulfilled' ? srv.value : [];
      const socRes = soc.status === 'fulfilled' ? soc.value : [];
      const galRes = gal.status === 'fulfilled' ? gal.value : [];
      const faqRes = faq.status === 'fulfilled' ? faq.value : [];
      const navRes = nav.status === 'fulfilled' ? nav.value : [];

      setProfileData(profRes);
      setProjectsData(prjsRes);
      setCounts({
        profile: profRes ? 1 : 0,
        skills: sksRes.length,
        projects: prjsRes.length,
        experience: expsRes.length,
        education: eduRes.length,
        services: srvRes.length,
        socials: socRes.length,
        gallery: galRes.length,
        faqs: faqRes.length,
        nav: navRes.length,
      });
    } catch {
      // Ignore fallback silently
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  const stats = [
    { label: 'Profile', count: counts.profile, icon: User, color: 'bg-blue-100 text-blue-600', path: '/admin/profile' },
    { label: 'Skills', count: counts.skills, icon: Code, color: 'bg-green-100 text-green-600', path: '/admin/skills' },
    { label: 'Projects', count: counts.projects, icon: FolderKanban, color: 'bg-purple-100 text-purple-600', path: '/admin/projects' },
    { label: 'Experience', count: counts.experience, icon: Briefcase, color: 'bg-orange-100 text-orange-600', path: '/admin/experience' },
    { label: 'Education', count: counts.education, icon: GraduationCap, color: 'bg-pink-100 text-pink-600', path: '/admin/education' },
    { label: 'Services', count: counts.services, icon: Wrench, color: 'bg-indigo-100 text-indigo-600', path: '/admin/services' },
    { label: 'Socials', count: counts.socials, icon: Share2, color: 'bg-teal-100 text-teal-600', path: '/admin/socials' },
    { label: 'Gallery', count: counts.gallery, icon: Image, color: 'bg-cyan-100 text-cyan-600', path: '/admin/gallery' },
    { label: 'FAQs', count: counts.faqs, icon: HelpCircle, color: 'bg-red-100 text-red-600', path: '/admin/faqs' },
    { label: 'Navigation', count: counts.nav, icon: List, color: 'bg-amber-100 text-amber-600', path: '/admin/nav' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage all content for your portfolio website live from Supabase</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium whitespace-nowrap"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span className="hidden sm:inline">View Live Site</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-500 text-sm">Fetching live dashboard statistics...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const isActive = location.pathname === stat.path;
              return (
                <Link
                  key={stat.label}
                  to={stat.path}
                  className={`p-4 sm:p-5 rounded-xl border transition-all duration-200 ${
                    isActive
                      ? 'border-blue-300 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  </div>
                  <div className="mt-3 sm:mt-4">
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.count}</p>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{stat.label}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <Link to="/admin/profile" className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors text-left">
                  <p className="font-medium text-gray-900 text-sm sm:text-base">Edit Profile</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Update name, role, bio, contact info</p>
                </Link>
                <Link to="/admin/projects" className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors text-left">
                  <p className="font-medium text-gray-900 text-sm sm:text-base">Manage Projects</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Add, edit, or remove portfolio projects</p>
                </Link>
                <Link to="/admin/skills" className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors text-left">
                  <p className="font-medium text-gray-900 text-sm sm:text-base">Update Skills</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage technical and soft skills</p>
                </Link>
                <Link to="/admin/experience" className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors text-left">
                  <p className="font-medium text-gray-900 text-sm sm:text-base">Edit Experience</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Update work history and internships</p>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Current Profile Preview</h2>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium text-gray-900">{profileData.name || 'Nischal Rai'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-500">Role</span>
                  <span className="font-medium text-gray-900">{profileData.role || 'Full Stack Developer'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-900 truncate">{profileData.email || 'nischalrai@example.com'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-500">Location</span>
                  <span className="font-medium text-gray-900">{profileData.location || 'London, UK'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 pt-2 border-t border-gray-100">
                  <span className="text-gray-500">Total Projects</span>
                  <span className="font-medium text-gray-900">{counts.projects}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-500">Featured Projects</span>
                  <span className="font-medium text-gray-900">{projectsData.filter(p => p.featured).length}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-500">Total Skills</span>
                  <span className="font-medium text-gray-900">{counts.skills}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
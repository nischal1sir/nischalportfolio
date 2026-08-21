import { createHashRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const App = lazy(() => import('../App').then(m => ({ default: m.default })));
const Home = lazy(() => import('../pages/Home').then(m => ({ default: m.default })));
const About = lazy(() => import('../pages/About').then(m => ({ default: m.default })));
const Skills = lazy(() => import('../pages/Skills').then(m => ({ default: m.default })));
const Projects = lazy(() => import('../pages/Projects').then(m => ({ default: m.default })));
const Experience = lazy(() => import('../pages/Experience').then(m => ({ default: m.default })));
const Contact = lazy(() => import('../pages/Contact').then(m => ({ default: m.default })));
const Resume = lazy(() => import('../pages/Resume').then(m => ({ default: m.default })));
const GalleryPage = lazy(() => import('../pages/Gallery').then(m => ({ default: m.default })));
const AdminLayout = lazy(() => import('../pages/admin/AdminLayout').then(m => ({ default: m.default })));
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin').then(m => ({ default: m.default })));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard').then(m => ({ default: m.default })));
const AdminProfile = lazy(() => import('../pages/admin/AdminProfile').then(m => ({ default: m.default })));
const AdminSkills = lazy(() => import('../pages/admin/AdminSkills').then(m => ({ default: m.default })));
const AdminProjects = lazy(() => import('../pages/admin/AdminProjects').then(m => ({ default: m.default })));
const AdminExperience = lazy(() => import('../pages/admin/AdminExperience').then(m => ({ default: m.default })));
const AdminEducation = lazy(() => import('../pages/admin/AdminEducation').then(m => ({ default: m.default })));
const AdminServices = lazy(() => import('../pages/admin/AdminServices').then(m => ({ default: m.default })));
const AdminSocials = lazy(() => import('../pages/admin/AdminSocials').then(m => ({ default: m.default })));
const AdminGallery = lazy(() => import('../pages/admin/AdminGallery').then(m => ({ default: m.default })));
const AdminFAQs = lazy(() => import('../pages/admin/AdminFAQs').then(m => ({ default: m.default })));
const AdminNav = lazy(() => import('../pages/admin/AdminNav').then(m => ({ default: m.default })));

const Loading = () => <div className="flex h-screen items-center justify-center">Loading...</div>;

const routes = createHashRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<Loading />}>
        <App />
      </Suspense>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Loading />}><Home /></Suspense> },
      { path: 'about', element: <Suspense fallback={<Loading />}><About /></Suspense> },
      { path: 'skills', element: <Suspense fallback={<Loading />}><Skills /></Suspense> },
      { path: 'projects', element: <Suspense fallback={<Loading />}><Projects /></Suspense> },
      { path: 'experience', element: <Suspense fallback={<Loading />}><Experience /></Suspense> },
      { path: 'contact', element: <Suspense fallback={<Loading />}><Contact /></Suspense> },
      { path: 'resume', element: <Suspense fallback={<Loading />}><Resume /></Suspense> },
      { path: 'gallery', element: <Suspense fallback={<Loading />}><GalleryPage /></Suspense> },
      { path: 'about/gallery', element: <Suspense fallback={<Loading />}><GalleryPage /></Suspense> },
      { path: '*', element: <Suspense fallback={<Loading />}><Home /></Suspense> },
    ],
  },
  {
    path: '/admin',
    element: (
      <Suspense fallback={<Loading />}>
        <AdminLayout />
      </Suspense>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Loading />}><AdminDashboard /></Suspense> },
      { path: 'login', element: <Suspense fallback={<Loading />}><AdminLogin /></Suspense> },
      { path: 'profile', element: <Suspense fallback={<Loading />}><AdminProfile /></Suspense> },
      { path: 'skills', element: <Suspense fallback={<Loading />}><AdminSkills /></Suspense> },
      { path: 'projects', element: <Suspense fallback={<Loading />}><AdminProjects /></Suspense> },
      { path: 'experience', element: <Suspense fallback={<Loading />}><AdminExperience /></Suspense> },
      { path: 'education', element: <Suspense fallback={<Loading />}><AdminEducation /></Suspense> },
      { path: 'services', element: <Suspense fallback={<Loading />}><AdminServices /></Suspense> },
      { path: 'socials', element: <Suspense fallback={<Loading />}><AdminSocials /></Suspense> },
      { path: 'gallery', element: <Suspense fallback={<Loading />}><AdminGallery /></Suspense> },
      { path: 'faqs', element: <Suspense fallback={<Loading />}><AdminFAQs /></Suspense> },
      { path: 'nav', element: <Suspense fallback={<Loading />}><AdminNav /></Suspense> },
    ],
  },
]);

export default routes;

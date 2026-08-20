import { createHashRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import About from '../pages/About';
import Skills from '../pages/Skills';
import Projects from '../pages/Projects';
import Experience from '../pages/Experience';
import Contact from '../pages/Contact';
import Resume from '../pages/Resume';
import AdminLayout from '../pages/admin/AdminLayout';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProfile from '../pages/admin/AdminProfile';
import AdminSkills from '../pages/admin/AdminSkills';
import AdminProjects from '../pages/admin/AdminProjects';
import AdminExperience from '../pages/admin/AdminExperience';
import AdminEducation from '../pages/admin/AdminEducation';
import AdminServices from '../pages/admin/AdminServices';
import AdminSocials from '../pages/admin/AdminSocials';
import AdminGallery from '../pages/admin/AdminGallery';
import AdminFAQs from '../pages/admin/AdminFAQs';
import AdminNav from '../pages/admin/AdminNav';

const routes = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'skills', element: <Skills /> },
      { path: 'projects', element: <Projects /> },
      { path: 'experience', element: <Experience /> },
      { path: 'contact', element: <Contact /> },
      { path: 'resume', element: <Resume /> },
      { path: '*', element: <Home /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'login', element: <AdminLogin /> },
      { path: 'profile', element: <AdminProfile /> },
      { path: 'skills', element: <AdminSkills /> },
      { path: 'projects', element: <AdminProjects /> },
      { path: 'experience', element: <AdminExperience /> },
      { path: 'education', element: <AdminEducation /> },
      { path: 'services', element: <AdminServices /> },
      { path: 'socials', element: <AdminSocials /> },
      { path: 'gallery', element: <AdminGallery /> },
      { path: 'faqs', element: <AdminFAQs /> },
      { path: 'nav', element: <AdminNav /> },
    ],
  },
]);

export default routes;

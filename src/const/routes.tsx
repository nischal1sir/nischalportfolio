import { createHashRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import About from '../pages/About';
import Skills from '../pages/Skills';
import Projects from '../pages/Projects';
import Experience from '../pages/Experience';
import Contact from '../pages/Contact';
import Resume from '../pages/Resume';

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
]);

export default routes;

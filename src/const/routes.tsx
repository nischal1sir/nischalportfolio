import { createHashRouter } from "react-router-dom";
import App from "../App";                          // ← import your layout
import LandingPage from "../pages/landingPage";
import Resume from "../pages/resume";
// import About from "../pages/about";
// import Projects from "../pages/projects";
// import TechStack from "../pages/techStack";
// import Experience from "../pages/experience";
// import Connect from "../pages/connect";
// import Resume from "../pages/resume";

const routes = createHashRouter([
  {
    path: "/",
    element: <App />,                              // ← App wraps everything
    children: [
      { index: true, element: <LandingPage /> },
      // { path: "about", element: <About /> },
      // { path: "projects", element: <Projects /> },
      // { path: "tech", element: <TechStack /> },
      // { path: "experience", element: <Experience /> },
      // { path: "connect", element: <Connect /> },
      { path: "resume", element: <Resume /> },
    ]
  }
]);

export default routes;
import { createHashRouter } from "react-router-dom";
import App from "../App";
import LandingPage from "../pages/landingPage";
import TechStack from "../pages/techStack";   
import Resume from "../pages/resume";
import About from "../pages/aboutMe";
// import Connect from "../pages/Connect";

const routes = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "tech", element: <TechStack /> },
      { path: "resume", element: <Resume /> },
      {
        path:"about",element:<About/>
      },
      {
        // path:"connect",element:<Connect/>
      },
    ]
  }
]);

export default routes;
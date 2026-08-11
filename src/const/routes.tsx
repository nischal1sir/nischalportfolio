import { createHashRouter } from "react-router-dom";
import App from "../App";
import LandingPage from "../pages/landingPage";
import TechStack from "../pages/techStack";   // ← match exact file name
import Resume from "../pages/resume";

const routes = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "tech", element: <TechStack /> },
      { path: "resume", element: <Resume /> },
    ]
  }
]);

export default routes;
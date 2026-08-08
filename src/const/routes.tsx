import { createHashRouter } from "react-router-dom";  // <-- was createBrowserRouter
import LandingPage from "../pages/landingPage";

const routes = createHashRouter([  // <-- use createHashRouter
  {
    path: "/",
    element: <LandingPage />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
    ]
  }
]);

export default routes;
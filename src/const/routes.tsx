import { createBrowserRouter } from "react-router-dom";

import LandingPage from "../pages/landingPage";
const routes = createBrowserRouter([{
path:"/",
element:<LandingPage/>,
children:[
    {
        index:true,
        element:<LandingPage/>,
    },
]


}]);

export default routes;

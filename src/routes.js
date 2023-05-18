import { useRoutes } from "react-router-dom";
import Home from "./pages/Home";

export default function Router(){

   const routes = [
        {
            name: 'Home',
            path: '/home',
            element: <Home />
        },
        {
            name: 'Home',
            path: '*',
            element: <Home />
        }
    ]

    return useRoutes(routes);
}
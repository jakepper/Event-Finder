import { useState } from "react";
import { createBrowserRouter, Navigate, RouterProvider, useLocation } from "react-router-dom";

import { ApiContext } from "./contexts/api";
import { Api } from "./lib/api";

import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Root from "./pages/Root/Root";
import Home from "./pages/Home/Home";
import Event from "./pages/Event/Event";
import CreateEvent from "./pages/CreateEvent/CreateEvent";

const router = createBrowserRouter([
   {
      path: '/event-finder/',
      element: <Root />,
      children: [
         {
            path: 'login',
            element: <Login />
         },
         {
            path: 'signup',
            element: <SignUp />
         },
         {
            path: 'home',
            element: <Home />
         },
         {
            path: 'event/:id',
            element: <Event />
         },
         {
            path: 'create-event',
            element: <CreateEvent />
         }
      ]
   },
   {
      path: '/',
      element: <Navigate to="/event-finder/home" />
   }
]);

export default function App() {

   const [api, setApi] = useState(new Api());

   return (
      <>
         <ApiContext.Provider value={api}>
            <RouterProvider router={router} />
         </ApiContext.Provider>
      </>
   );
}

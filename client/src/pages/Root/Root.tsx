import "./Root.css";

import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

import { useApi } from "../../hooks/useApi";

export default function Root() {

   const api = useApi();

   const [page, setPage] = useState('home');
   const [loggedIn, setLoggedIn] = useState(false);
   const [user, setUser] = useState<Record<string, any>>();

   const getUser = async () => {
      const [result, body] = await api.get('users/');
      if (result.ok) {
         setUser(body.user);
         setLoggedIn(true);
      }
   }

   const login = () => {
      setPage('');
   }

   const logout = () => {
      setPage('');
      setLoggedIn(false);
      api.logout();
   }

   useEffect(() => {
      getUser();
   }, []);
   
   return (
      <>
         <div className="navbar">
            <Link to="/event-finder/home"><h1>EVENT FINDER</h1></Link>
            <nav>
               <ul className="nav-items">
                  <li className={page == 'home' ? 'active' : ''} onClick={() => setPage('home')}>
                        <Link to="/event-finder/home">HOME</Link>
                  </li>
                  <li className={page == 'about' ? 'active' : ''} onClick={() => setPage('about')}>
                     <Link to="/event-finder/home">ABOUT</Link>
                  </li>
                  {
                     loggedIn ? 
                     <li onClick={logout}>
                        <Link to="/event-finder/login">LOGOUT</Link>
                     </li>
                     : <li onClick={login}>
                        <Link to="/event-finder/login">LOGIN</Link>
                     </li>
                  }
                  <li>
                     <button className="spotify">Acivate Spotify</button>
                  </li>
               </ul>
            </nav>
         </div>
         <Outlet context={{loggedIn: [loggedIn, setLoggedIn], user: [user, setUser]}} />
      </>
   );
}
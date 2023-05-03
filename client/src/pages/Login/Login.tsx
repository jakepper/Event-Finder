import "./Login.css";

import { useOutletContext } from "react-router-dom";

import LoginForm from "../../components/LoginForm/LoginForm";
import OutletContext from "../../types/OutletContext";

export default function Login() {

   const { loggedIn, user,  } = useOutletContext<OutletContext>();

   return (
      <div className="center">
         <div className="form-content">
            <h1>Login</h1>
            <LoginForm setLoggedIn={loggedIn[1]} setUser={user[1]}/>
         </div>
      </div>
   );
}
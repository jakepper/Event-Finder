import { useState, FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useApi } from "../../hooks/useApi";

import TextInput from "../TextInput/TextInput";

type LoginFormProps = {
   setLoggedIn: (value:boolean) => void,
   setUser: (value:Record<string,any>) => void
}

export default function LoginForm({ setLoggedIn, setUser }: LoginFormProps) {

   const api = useApi();
   const navigate = useNavigate();

   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState(false);
   
   const login = async (e: FormEvent) => {
      e.preventDefault();

      const [result, body] = await api.login({
         email,
         password
      });
      console.log(body);

      if (result.ok) {
         setLoggedIn(true);
         setUser(body.user);
         console.log(`Logged in as ${email}`);
         return navigate('/event-finder/home');
      }

      setError(true);
   }
   
   return (
      <>
         <form onSubmit={login}>
            <TextInput
               value={email} label="Email" placeholder=" " type="email" 
               onChange={(e : ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
            <TextInput
               value={password} label="Password" placeholder=" " type="password" 
               onChange={(e : ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />

            {error && <p className="form-error">Invalid Email or Password</p>}
            
            <button type="submit">Submit</button>
            <p>No Account? - <Link to="/event-finder/signup"><button className="btn-small">signup</button></Link></p>
         </form>
      </>
   );
}
import { useState, FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useApi } from "../../hooks/useApi";

import TextInput from "../TextInput/TextInput";

export default function SignUpForm() {
   
   const api = useApi();
   const navigate = useNavigate();

   const [firstName, setFirstName] = useState('');
   const [lastName, setLastName] = useState('');
   const [email, setEmail] = useState('');
   const [password1, setPassword1] = useState('');
   const [password2, setPassword2] = useState('');
   const [error, setError] = useState(false);
   const [errorMessage, setErrorMessage] = useState('');
   
   const register = async (e: FormEvent) => {
      e.preventDefault();

      if (password1 != password2) {
         setError(true);
         return;
      }

      const [result, body] = await api.register({
         firstName,
         lastName,
         email,
         password: password1
      });
      console.log(body);

      if (result.ok) {
         console.log(`Logged in as ${email}`);
         return navigate('/event-finder/home');
      }

      setError(true);
      setErrorMessage(body.message);
   }
   
   return (
      <>
         <form onSubmit={register}>
            <TextInput
               value={firstName} label="First Name" placeholder=" " type="text" 
               onChange={(e : ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
            />
            <TextInput
               value={lastName} label="Last Name" placeholder=" " type="text" 
               onChange={(e : ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
            />
            <TextInput
               value={email} label="Email" placeholder=" " type="email" 
               onChange={(e : ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
            <TextInput
               value={password1} label="Password" placeholder=" " type="password" 
               onChange={(e : ChangeEvent<HTMLInputElement>) => setPassword1(e.target.value)}
            />
            <TextInput
               value={password2} label="Confirm Password" placeholder=" " type="password" 
               onChange={(e : ChangeEvent<HTMLInputElement>) => setPassword2(e.target.value)}
            />

            {error && <p className="form-error">{ errorMessage }</p>}

            <button type="submit">Submit</button>
            <p>Have an Account - <Link to="/event-finder/login"><button className="btn-small">Login</button></Link></p>
         </form>
      </>
   );
}
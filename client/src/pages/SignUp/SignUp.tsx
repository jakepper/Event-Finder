import "./SignUp.css";

import SignUpForm from "../../components/SignUpForm/SignUpForm";

export default function SignUp() {
   return (
      <div className="center">
         <div className="form-content">
            <h1>Sign Up</h1>
            <SignUpForm />
         </div>
      </div>
   );
}
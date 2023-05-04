import "./CreateEvent.css";

import { useOutletContext } from "react-router-dom";

import EventForm from "../../components/EventForm/EventForm";
import OutletContext from "../../types/OutletContext";


export default function CreateEvent() {

   const { loggedIn, user, page } = useOutletContext<OutletContext>();

   return (
      <div className="center">
         <div className="form-content">
            {
               loggedIn[0] ?
                  <><h1>New Event</h1><EventForm /></> :
                  <h2>Please login or create an account to publish an event</h2>
            }
         </div>
      </div>
   );
}
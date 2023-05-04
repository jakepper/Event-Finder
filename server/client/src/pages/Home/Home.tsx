import "./Home.css";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useApi } from "../../hooks/useApi";
import EventCard from "../../components/EventCard/EventCard";

export default function HomePage() {

   const api = useApi();
   const navigate = useNavigate();

   const [events, setEvents] = useState<Record<string,any>[]>([]);

   const loadEvents = async () => {
      const [result, body] = await api.get("events/");
      console.log(body);
      if (result.ok) {
         setEvents(body.events);
      }
   }

   useEffect(() => {
      loadEvents();
   }, []);

   return (
      <div className="content">
         <div className="home-header">
            <button onClick={() => navigate("/event-finder/create-event")}>Add Event</button>
         </div>
         <section className="grid">
            {events.map(event => (
               <div key={event._id} className="card"
                  onClick={() => navigate(`/event-finder/event/${event._id}`)}
               >
                  <EventCard event={event} />
               </div>
            ))}
         </section>
      </div>
   );
}
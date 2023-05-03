import "./Home.css";

import { useState, useEffect } from "react";

import { useApi } from "../../hooks/useApi";
import EventCard from "../../components/EventCard/EventCard";

export default function HomePage() {

   const api = useApi();

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
      <div className="center">
         <div className="content">
            {events.map(event => <div key={event._id} className="event"><EventCard event={event} /></div>)}
         </div>
      </div>
   );
}
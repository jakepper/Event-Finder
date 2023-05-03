import { useNavigate } from "react-router-dom"

type EventCardProps = {
   event: Record<string,any>
}

export default function EventCard({ event }: EventCardProps) {
   const navigate = useNavigate();
   return (
      <>
        <p onClick={() => navigate(`/event-finder/event/${event._id}`)}>{event.artist} @ {event.venue}</p>
      </>
   )
}
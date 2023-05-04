type EventCardProps = {
   event: Record<string,any>
}

export default function EventCard({ event }: EventCardProps) {
   return (
      <>
         {/* <h2>{event.name}</h2> */}
         <h4>{event.artist}</h4>
         <p>@ {event.venue}</p>
         <p className="card-date">{new Date(event.date).toDateString()}</p>
      </>
   )
}
import "./Event.css";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useParams, useOutletContext } from "react-router-dom";

import { useApi } from "../../hooks/useApi";
import { socket } from "../../lib/socket";
import OutletContext from "../../types/OutletContext";

import Map from "../../components/EventMap/EventMap";

type EventData = {
   _id: string
   name: string
   venue: string
   artist: string
   date: Date
   location: {
      address: string
      city: string
      state: string
      code: string
   },
   publisherId: string
   url?: string
}

type Message = {
   user: string,
   content: string,
   date: string
}

export default function EventPage() {

   const api = useApi();
   const { id } = useParams();
   const { loggedIn, user, page } = useOutletContext<OutletContext>();
   const scrollRef = useRef<HTMLDivElement | null>(null);

   const [connected, setConnected] = useState(socket.connected);
   const [eventRoom, setEventRoom] = useState(id);
   const [message, setMessage] = useState("");
   const [event, setEvent] = useState<Record<string,any>>();
   const [messages, setMessages] = useState<Message[]>([]);

   const loadEvent = async () => {
      const [result, body] = await api.get(`events/${id}`);
      if (result.ok) {
         setMessages(body.event.chats);
         setEvent(body.event as EventData);
      }
   }

   useEffect(() => {
      page[1]('');
      loadEvent();

      socket.connect();

      const onConnect = () => {
         setConnected(true);
      }

      const onDisconnect = () => {
         setConnected(false);
      }

      const onJoinEventRoom = (id : string) => {
         setEventRoom(id);
      }

      const onReceiveMessage = (value: Message) => {
         console.log("received message:");
         console.log(value);
         setMessages(previous => [...previous, value]);
      }

      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
      socket.on('join', onJoinEventRoom);
      socket.on('receive-message', onReceiveMessage);

      socket.emit('join', id);

      return () => {
         socket.disconnect();
      }
   }, []);

   useEffect(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth"});
   }, [messages]);

   const sendMessage = (e : FormEvent) => {
      e.preventDefault();

      if (message == "") return;
      const data = {
         user: user[0].firstName,
         content: message,
         date: new Date().toDateString()
      }
      setMessages(previous => [...previous, data]);
      socket.emit('send-message', {
         eventRoom,
         message: data
      });
      setMessage('');
   }

   return (
      <div className="content">
         <div className="h-100">
            <div className="col-5 h-100">
               <div className="messages">
                  {messages.map((message: Message) => {
                     return (
                        <div className="item">
                           <p className="message-username">{ message.user }<span className="message-date">{new Date(message.date).toDateString()}</span></p>
                           <p className="message-content">{ message.content }</p>
                        </div>
                     );
                  })}
                  <div ref={scrollRef} />
               </div>
               <form className="input" onSubmit={(e) => sendMessage(e)}>
                     {
                     loggedIn[0] ? <input value={message} type="text" name="message" id="message" placeholder="message..." onChange={(e) => setMessage(e.target.value)}/>
                     : <input value={message} type="text" name="message" id="message" placeholder="login to send messages..." disabled/>
                  }
                  <button type="submit">SEND</button>
               </form>
            </div>
            <div className="col-7 h-100">
               <div className="event-details row h-50">
                  <div className="text col-12 h-100">
                     <a href={event?.url}><h1>{event?.name}</h1></a>
                     <p>{event?.artist} @ {event?.venue}</p>
                     <p>{new Date(event?.date).toUTCString()}</p>
                     <p>{`${event?.location.address}, ${event?.location.city}, ${event?.location.state}, ${event?.location.code}`}</p>
                  </div>
               </div>
               <div className="event-map row h-50">
                  {event && <Map location={event?.location} />}
               </div>
            </div>
         </div>         
      </div>
   );
}
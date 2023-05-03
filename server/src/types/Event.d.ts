import { ObjectId } from "mongodb";
import Message from "./Message";

export interface Event {
   _id: ObjectId
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
   publisherId: ObjectId
   url?: string
   chats: Message[]
}

export interface CreateEventBody {
   name: string
   venue: string
   artist: string
   date: string
   location: {
      address: string
      city: string
      code: string
      state: string
   }
   url?: string
}

export interface GetEventsBody {
   code: string
}


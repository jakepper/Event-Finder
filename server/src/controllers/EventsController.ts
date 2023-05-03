import { MongoClient, ObjectId } from "mongodb";
import { RequestHandler } from "express";

import { RequestWithJWTBody } from "../dto/jwt";

import { controller } from "../lib/controller";
import { Event, CreateEventBody, GetEventsBody } from "../types/Event"

const getEvents = (client: MongoClient): RequestHandler =>
   async (req, res) => {
      
      const db = client.db("App");
      const collection = db.collection<Event>("Events");
      const events = await collection.find<Event>({}).toArray();

      return res.json({ events });
   }

const getEventsNearArea = (client: MongoClient): RequestHandler =>
   async (req, res) => {
      
      const code = req.params.code;
      if (!code) {
         return res.status(400).json({ message: "Bad Request" });
      }

      const db = client.db("App");
      const collection = db.collection<Event>("Events");
      const events = await collection.find<Event>({
         "location.code": code
      }).toArray();

      return res.json({ events });
   }

const getEvent = (client: MongoClient): RequestHandler =>
   async (req, res) => {
      const id = req.params.id;
      if (!id) {
         return res.status(400).json({ message: "Bad Request" });
      }

      const db = client.db("App");
      const collection = db.collection<Event>("Events");
      const event = await collection.findOne<Event>({
         _id: new ObjectId(id)
      });

      if (event == null) {
         return res.status(400).json({ message: "Bad Request" });
      }

      return res.json({ event });
   }

const createEvent = (client: MongoClient): RequestHandler =>
   async (req : RequestWithJWTBody, res) => {
      const publisherId = req.jwtBody?.userId;
      if (!publisherId)
      {
         return res.status(400).json({ message: "Bad Request" });
      }

      const { name, venue, artist, date, location, url } = req.body as CreateEventBody;

      const db = client.db("App");
      const collection = db.collection("Events");

      try {
         const insertResult = await collection.insertOne({
            name,
            venue,
            artist,
            date: new Date(date),
            location,
            publisherId,
            url,
            chats: []
         });

         if (!insertResult.acknowledged) {
            return res.status(400).json({ message: "Bad Request" });
         }

         const id = insertResult.insertedId.toString();
         const event = await collection.findOne<Event>(
            { _id: new ObjectId(id)}
         );

         return res.json({ event });
      }
      catch (error)
      {
         console.error(error);
         return res.status(400).json({ message: "Error Creating Event" });
      }
   }

export const EventsController = controller(
   "events",
   [
      { path: "/", endpointBuilder: getEvents, method: "get", skipAuth: true},
      { path: "/near/:code", endpointBuilder: getEventsNearArea, method: "get", skipAuth: true},
      { path: "/:id", endpointBuilder: getEvent, method: "get", skipAuth: true},
      { path: "/add", method: "post", endpointBuilder: createEvent }
   ]
);
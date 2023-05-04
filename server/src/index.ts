import * as path from 'path';
import dotenv from "dotenv";
import express from "express";
import http from "http";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import { Server } from "socket.io";

import { UsersController } from "./controllers/UsersController";
import { EventsController } from "./controllers/EventsController";

import LoginBody from "./types/Login";
import { User } from "./types/User";

dotenv.config();
var env = process.env.NODE_ENV || 'development';

// INITIALIZE EXPRESS SERVER //

const app = express();
app.use(express.json());
if (env == 'development') {
   app.use(cors());
}
else {
   app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
}
const server = http.createServer(app);

// INITIALIZE MONGODB CLIENT //

const client = new MongoClient(process.env.MONGODB_URI!!, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   }
});

// INITIALIZE SOCKET.IO //
let options = {}
if (env == 'development') {
   options = {
      cors: {
         // origin: "http://127.0.0.1:5000",
         origin: "http://localhost:5000",
         methods: ["GET", "POST"]
      }
   }
}
const io = new Server(server, options);

// SOCKET.IO EVENTS //

io.on("connection", (socket) => {
   console.log(`socket.io connection: ${socket.id}`);

   socket.on("join", (data) => {
      socket.join(data);
      console.log(`Connection ${socket.id} joined room ${data}`);
   });

   socket.on("send-message", (data) => {
      socket.to(data.eventRoom).emit("receive-message", data.message);

      const db = client.db("App");
      const collection = db.collection("Events");
      collection.updateOne(
         {
            _id: new ObjectId(data.eventRoom)
         }, 
         {
            $push: {
               chats: {
                  $each: [{ user: data.message.user, content: data.message.content, date: data.message.date }]
               }
            }
         }
      );
   });

   socket.on("disconnect", (reason) => {
      console.log(`socket ${socket.id} disconnected due to ${reason}`);
   });
});

// SERVER ENDPOINTS //

app.post("/login", async (req, res) => {
   const { email, password } = req.body as LoginBody;

   const db = client.db("Auth");
   const collection = db.collection<User>("Users");
   const user = await collection.findOne<User>(
      { email }
   );

   if (!user) {
      return res.status(404).json({ message: "Invalid Email" });
   }

   const isValid = await bcrypt.compare(password, user.passwordHash);
   if (!isValid) {
      return res.status(404).json({ message: "Invalid Password" });
   }

   const token = jwt.sign({ userId: user._id.toString() }, process.env.ENCRYPTION_KEY!!, { expiresIn: '2h' });
  
   user.passwordHash = "";
   return res.json({ user, token });
});

// ---------------------------------------
// endpoint   : Action
// ---------------------------------------
// Controller(app, client);

// ---------------------------------------
// users/     : Get User
// users/add  : Create User
// ---------------------------------------
UsersController(app, client);

// ---------------------------------------
// events/    : Get Events
// events/add : Create Event
// ---------------------------------------
EventsController(app, client);

// SERVE REACT APP (production)

if (env == 'production') {
   app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
   });
}

// START SERVER //
server.listen(process.env.PORT || 3000, () => {
   console.log(`Server listening at http://localhost:${process.env.PORT}/`);
});
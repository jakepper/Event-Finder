import { MongoClient, ObjectId } from "mongodb";
import { RequestHandler } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RequestWithJWTBody } from "../dto/jwt";

import { controller } from "../lib/controller";
import { User, CreateUserBody } from "../types/User"


const getUser = (client: MongoClient): RequestHandler =>
  async (req: RequestWithJWTBody, res) => {
      const userId = req.jwtBody?.userId;
      if (!userId) {
         return res.status(401).json({ message: "Unauthorized" });
      }

      const db = client.db("Auth");
      const collection = db.collection<User>("Users");
      const user = await collection.findOne<User>(
         { _id: new ObjectId(userId) }
      ) as User;

      if (!user)
      {
         return res.status(401).json({ message: "Unauthorized" });
      }
      
      user.passwordHash = "";
      return res.json({ user });
  }

const createUser = (client: MongoClient): RequestHandler =>
  async (req, res) => {
      const {firstName, lastName, email, password} = req.body as CreateUserBody;
      const passwordHash = await bcrypt.hash(password, 10);

      const db = client.db("Auth");
      const collection = db.collection("Users");

      try {
         const insertResult = await collection.insertOne({
            firstName,
            lastName,
            email,
            passwordHash
         });

         if (!insertResult.acknowledged) {
            return res.status(400).json({ message: "Error: Please Fill Out Each Field Properly" });
         }

         const id = insertResult.insertedId.toString();

         const token = jwt.sign(
            { userId: id }, 
            process.env.ENCRYPTION_KEY!!, 
            { expiresIn: '2h' }
         );

         const user = await collection.findOne<User>(
            { _id: new ObjectId(id)}
         );

         if (user != null) user.passwordHash = "";
         return res.json({ user, token });
      }
      catch (error)
      {
         console.error(error);
         return res.status(400).json({ message: "Error: User Already Exists" });
      }
  }

export const UsersController = controller(
  "users",
  [
    { path: "/", method: "get", endpointBuilder: getUser },
    { path: "/add", method: "post", endpointBuilder: createUser, skipAuth: true }
  ]
);
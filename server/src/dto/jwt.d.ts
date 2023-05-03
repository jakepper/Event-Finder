import { Request } from "express"

export type JWTBody = {
  userId: string
}

export type RequestWithJWTBody = Request & {
  jwtBody?: JWTBody
}
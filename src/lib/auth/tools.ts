import jwt from "jsonwebtoken"
import { ObjectId } from "mongoose"

interface TokenPayload {
  _id: ObjectId
  // role: "User" | "Admin"
}

export const generateAccessToken = (payload: TokenPayload): Promise<string> =>
  new Promise((resolve, reject) =>
    jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1 week" }, (err, token) => {
      if (err) reject(err)
      else resolve(token as string)
    })
  )

export const verifyAccessToken = (token: string): Promise<TokenPayload> =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_SECRET!, (err, payload) => {
      if (err) rej(err)
      else res(payload as TokenPayload)
    })
  )

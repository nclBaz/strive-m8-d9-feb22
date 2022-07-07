import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import mongoose from "mongoose"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import roomsRouter from "./api/rooms/"

import connectionHandler from "./socket/"

const server = express()
const port = process.env.PORT || 3001

const httpServer = createServer(server)

// **************************************** MIDDLEWARES **********************************
server.use(cors())
server.use(express.json())

// ****************************************** ENDPOINTS **********************************
server.use("/rooms", roomsRouter)

// *************************************** ERROR HANDLERS ********************************

const io = new Server(httpServer)

io.on("connection", connectionHandler)

// if (process.env.MONGO_URL) {
//   mongoose.connect(process.env.MONGO_URL)
// } else {
//   throw new Error("MONGO_URL not defined!")
// }

mongoose.connect(process.env.MONGO_URL!)

mongoose.connection.on("connected", () => {
  httpServer.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server running on port ${port}`)
  })
})

import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import roomsRouter from "./api/rooms/"
import productsRouter from "./api/products"
import { badRequestHandler, unauthorizedHandler, forbiddenHandler, catchAllHandler, notFoundHandler } from "./errorHandlers"
import connectionHandler from "./socket/"
import usersRouter from "./api/users"

const server = express()

const httpServer = createServer(server)

// **************************************** MIDDLEWARES **********************************
server.use(cors())
server.use(express.json())

// ****************************************** ENDPOINTS **********************************
server.use("/rooms", roomsRouter)
server.use("/products", productsRouter)
server.use("/users", usersRouter)

// *************************************** ERROR HANDLERS ********************************
server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(forbiddenHandler)
server.use(notFoundHandler)
server.use(catchAllHandler)

const io = new Server(httpServer)

io.on("connection", connectionHandler)

// if (process.env.MONGO_URL) {
//   mongoose.connect(process.env.MONGO_URL)
// } else {
//   throw new Error("MONGO_URL not defined!")
// }

export { server, httpServer }

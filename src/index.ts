import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"
import { httpServer, server } from "./server"

const port = process.env.PORT || 3001

mongoose.connect(process.env.MONGO_URL!)

mongoose.connection.on("connected", () => {
  httpServer.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server running on port ${port}`)
  })
})

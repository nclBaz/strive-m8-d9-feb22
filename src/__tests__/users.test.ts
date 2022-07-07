import mongoose from "mongoose"
import supertest from "supertest"
import dotenv from "dotenv"
import { server } from "../server"
import UsersModel from "../models/users"

dotenv.config() // This command forces .env variables to be loaded into process.env. It is the way to go when you cannot do -r dotenv/config

const client = supertest(server) // Supertest is capable of running server.listen and gives us back a client to be used to run http requests against our server

beforeAll(async () => {
  // Before all hook could be used to connect to mongo and also do some initial setup (like inserting some mock data)
  await mongoose.connect(process.env.MONGO_TESTDB_URL!) // DO NOT FORGET TO CONNECT TO MONGO! OTHERWISE YOU GONNA GET SOME TIMEOUT ERRORS
})

afterAll(async () => {
  // After all hook could be used to close the connection to mongo in the proper way and to clean up db/collections
  await UsersModel.deleteMany()
  await mongoose.connection.close()
})

const validUser = {
  name: "Alice",
  email: "alice@1234.com",
  password: "1234",
}

const notValidUser = {
  name: "Alice",
  email: "alice@1234.com",
  password: "12345",
}

let token: string

describe("Tests users' endpoints", () => {
  test("Should check that when POST /users it returns 201 and a valid _id", async () => {
    const response = await client.post("/users").send(validUser).expect(201)
    expect(response.body).toHaveProperty("_id")
  })

  test("Should check that we can login using POST /users/login with a valid user", async () => {
    const response = await client.post("/users/login").send(validUser).expect(200)
    expect(response.body).toHaveProperty("accessToken")
    token = response.body.accessToken
  })

  test("Should check that we cannot login using POST /users/login with wrong credentials", async () => {
    await client.post("/users/login").send(notValidUser).expect(401)
  })

  test("Should check that GET /users returns users if you provide a valid token. Users shall not have passwords", async () => {
    const response = await client.get("/users").set("Authorization", `Bearer ${token}`).expect(200)

    expect(response.body[0].name).toBe("Alice")
    expect(response.body[0].password).not.toBeDefined()
  })

  test("Should check that we cannot GET the list of users without a valid token", async () => {
    await client.get("/users").expect(401)
  })
})

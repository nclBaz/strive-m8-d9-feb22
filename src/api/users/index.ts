import express from "express"
import createError from "http-errors"
import { JWTAuthMiddleware } from "../../lib/auth/token"
import { generateAccessToken } from "../../lib/auth/tools"
import UsersModel from "../../models/users"

const usersRouter = express.Router()

usersRouter.post("/", async (req, res, next) => {
  try {
    const newRoom = new UsersModel(req.body)
    const { _id } = await newRoom.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const users = await UsersModel.find()
    res.send(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await UsersModel.checkCredentials(email, password)

    if (user) {
      const accessToken = await generateAccessToken({ _id: user._id })
      res.send({ accessToken })
    } else {
      next(createError(401, `Credentials are not ok!`))
    }
  } catch (error) {
    next(error)
  }
})

export default usersRouter

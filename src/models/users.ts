import mongoose, { Model, Document } from "mongoose"
import bcrypt from "bcrypt"

const { Schema, model } = mongoose

interface User {
  name: string
  email: string
  password: string
}

interface UserDocument extends User, Document {}

// type UserDocument = Document<User>

interface UserModel extends Model<UserDocument> {
  checkCredentials(email: string, password: string): Promise<UserDocument | null>
}

const UsersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
)

UsersSchema.pre("save", async function (next) {
  const plainPW = this.password
  if (this.isModified("password")) {
    const hash = await bcrypt.hash(plainPW, 10)
    this.password = hash
  }
  next()
})

UsersSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  return user
}

UsersSchema.static("checkCredentials", async function (email, password) {
  const user = await this.findOne({ email })

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      return user
    } else {
      return null
    }
  } else {
    return null
  }
})

export default model<UserDocument, UserModel>("User", UsersSchema)

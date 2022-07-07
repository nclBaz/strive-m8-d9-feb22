import createHttpError from "http-errors"
import MessagesModel from "../models/messages"
import RoomsModel from "../models/rooms"

interface Message {
  text: string
  sender: string
}

export const saveMessage = async (message: Message, roomName: string) => {
  try {
    const room = await RoomsModel.findOne({ name: roomName })
    if (room) {
      // save message in messages collection
      const newMessage = new MessagesModel({ text: message.text, sender: message.sender, room: room._id })
      const savedMessage = await newMessage.save()
      return savedMessage
    } else {
      throw createHttpError(404, `Room with name ${roomName} not found!`)
    }
  } catch (error) {
    console.log(error)
  }
}

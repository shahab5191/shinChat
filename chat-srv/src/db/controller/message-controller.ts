import { Message } from "../models/message";
import { User } from "../models//user";
export const addMessageToDB = async (
  id: string,
  data: {
    msg: string;
    reciever: string;
  }
) => {
  const foundUser = User.findOne({ where: { id: data.reciever } });
  if (!foundUser) {
    throw new Error("reciever was not found!");
  }
  const newMessage = await Message.create({
    userId: id,
    message: data.msg,
    recieverId: data.reciever,
  });
  return newMessage.id
};

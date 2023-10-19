import { User } from "../../db/models/user";

export const messageIsValid = async (sender: string, reciever: string) => {
  let valid = true;
  valid &&= await senderNotBlocked(sender, reciever);
  return valid;
};

const senderNotBlocked = async (senderId: string, recieverId: string) => {
  const reciever = await User.findOne({ where: { id: recieverId } });
  if (!reciever) return false;
  if (reciever.blockList.indexOf(senderId) === -1) {
    return true;
  }
  return false;
};

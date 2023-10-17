import { Server, Socket } from "socket.io";
import { messageIsValid } from "../validators/validators";
import { client } from "../../db/redis";
import { addMessageToDB } from "../../db/controller/message-controller";

export const messageToClient = (io: Server, socket: Socket) => {
  socket.on("messageToClient", async (data: any, callback) => {
    console.log('message to client')
    if (!data.reciever || !data.msg) {
      return callback({ err: "provide valid message" });
    }
    const recieverSocket = await client.get(data.reciever);
    if (!(await messageIsValid(socket.data.user.id, data.reciever))) {
      return callback({ err: "user blocked" });
    }
    let messageId = "";
    try {
      socket.data.user.id;
      messageId = await addMessageToDB(socket.data.user.id, data);
    } catch (err) {
      callback({ status: "err" });
      return;
    }

    if (recieverSocket !== null) {
      try {
        const response = await io
          .timeout(5000)
          .to(recieverSocket)
          .emitWithAck("messageFromClient", {
            msg: data.msg,
            sender: socket.data.user.id,
            senderName: socket.data.user.username,
          });
        if (callback) callback({ status: response, messageId });
      } catch (err) {
        if (callback) callback({ status: "err" });
      }
    } else {
      if (callback) callback({ status: "sending", messageId });
    }
  });
};

import { io } from "../app";
import { addMessageToDB } from "../db/controller/message-controller";
import { client } from "../db/redis";
import { messageToClient } from "./events/message-to-client";
import { authenticateSocket } from "./middleware/authenticate";
import { messageIsValid } from "./validators/validators";

export const eventHandlers = () => {
  io.use((socket, next) => {
    const isAuthenticated = authenticateSocket(socket);
    if (isAuthenticated) {
      return next();
    }
    console.log('test')
    return socket.disconnect(true);
  });

  io.on("connection", async (socket) => {
    await client.set(socket.data.user.id, socket.id);
    console.log("user connected to socket.io with id:", socket.data.user.id);
    io.emit("connection", { id: socket.id });

    /** MessageToClient Eevent */
    messageToClient(io, socket)
    // socket.on("messageToClient", async (data: any, callback) => {
    //   if (!data.reciever || !data.msg) {
    //     return callback({ err: "provide valid message" });
    //   }
    //   const recieverSocket = await client.get(data.reciever);
    //   if (!(await messageIsValid(socket.data.user.id, data.reciever))) {
    //     return callback({ err: "user blocked" });
    //   }
    //   let messageId = ""
    //   try {
    //     socket.data.user.id;
    //     messageId = await addMessageToDB(socket.data.user.id, data);
    //   } catch (err) {
    //     callback({ status: "err" });
    //     return;
    //   }

    //   if (recieverSocket !== null) {
    //     try {
    //       const response = await chatIo
    //         .timeout(5000)
    //         .to(recieverSocket)
    //         .emitWithAck("messageFromClient", {
    //           msg: data.msg,
    //           sender: socket.data.user.id,
    //           senderName: socket.data.user.username
    //         });
    //       if (callback) callback({ status: response, messageId });
    //     } catch (err) {
    //       if (callback) callback({ status: "err" });
    //     }
    //   }else{
    //     if (callback) callback({ status: "sending", messageId });
    //   }
    // });
  });
};

import { Channel, Replies } from "amqplib";
import { rabbitWrapper } from "./connection";

export const subscribeToQeue = async (exchange: string, queueName: string) => {
  const rabbit = rabbitWrapper.connection;

  let channel: Channel | undefined;
  try {
    channel = await rabbit?.createChannel();
  } catch (err) {
    console.log(err);
  }
  if (!channel) {
    throw new Error("Couldn't create channel");
  }
  channel.assertExchange(exchange, "fanout", {
    durable: false,
  });

  let q: Replies.AssertQueue | undefined;
  try {
    q = await channel?.assertQueue(queueName, {
      exclusive: true,
    });
  } catch (err) {
    console.log(err);
  }
  if (!q) {
    throw new Error("couldn't create queue" + queueName);
  }

  channel.bindQueue(q.queue, exchange, "");
  channel.consume(q.queue, (msg) => {
    if (msg?.content) {
      console.log("[rabbitmq]\tmessage delivered", msg.content.toString());
    }
  });
};

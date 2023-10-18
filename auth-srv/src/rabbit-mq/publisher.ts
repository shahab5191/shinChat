import amqp, { Channel } from "amqplib";
import { rabbitWrapper } from "./connection";

export const publishToChannel = async (
  exchange: string,
  msg: string
) => {
  const rabbit = rabbitWrapper.connection;
  let channel: Channel | undefined;
  try {
    channel = await rabbit?.createChannel();
  } catch (err) {
    console.log(err);
  }
  channel?.assertExchange(exchange, "fanout", {
    durable: false,
  });
  channel?.publish(exchange, "", Buffer.from(msg));
  console.log("[rabbit]\tSent %s", msg);
};

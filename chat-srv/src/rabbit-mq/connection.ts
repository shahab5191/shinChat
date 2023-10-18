import amqp, { Connection } from "amqplib";
import { backoffFunc } from "./backoff";

class RabbitMQService {
  private _connection: Connection | undefined;
  private _server: string | undefined;

  public get connection() {
    return this._connection;
  }

  async connect() {
    const amqpUrl = process.env.RABBITMQ_URL;
    const amqpPort = process.env.RABBITMQ_PORT;
    if (!amqpUrl || !amqpPort) {
      throw new Error("Rabbitmq url or port is undefined!");
    }
    this._server = `amqp://${amqpUrl}:${amqpPort}`;
    const delay = 500;
    const maxTries = 2;
    const currentTry = 0;

    const connectToServer = async () => {
      if (this._server === undefined) {
        throw new Error("Rabbitmq url and port are undefined");
      }
      return await amqp.connect(this._server);
    };
    this._connection = await backoffFunc<Connection>(
      connectToServer,
      currentTry,
      maxTries,
      delay
    );
    console.log("Connection to rabbitMQ established!");
  }
}

export const rabbitWrapper = new RabbitMQService();

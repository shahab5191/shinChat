import amqp, { Connection } from "amqplib";
import { backoffFunc } from "./backoff";

class RabbitMQService {
  private _connection: Connection | undefined;
  private _server: string | undefined;

  public get connection() {
    return this._connection;
  }

  async connect(amqpUrl: string, amqpPort: number) {
    this._server = `${amqpUrl}:${amqpPort}`;
    const delay = 500;
    const maxTries = 5;
    const currentTry = 0;

    const connectToServer = async (server:string) => {
      return await amqp.connect(server)
    }
    this._connection = await backoffFunc<Connection>(connectToServer, currentTry, maxTries, delay)
    console.log("Connection to rabbitMQ established!")
  }
}

export const rabbitWrapper = new RabbitMQService()
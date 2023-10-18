import { sequelize } from "./db/connect";
import { httpServer } from "./app";
import { client } from "./db/redis";
import { rabbitWrapper } from "./rabbit-mq/connection";

let port = 4000;
if (process.env.PORT !== undefined) {
  port = Number.parseInt(process.env.PORT);
}
if (process.env.JWT_SECRET === undefined) {
  throw new Error("jwt secret is not available!");
}
const startService = async (): Promise<void> => {
  try {
    await client.connect();
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log("Connection to database has been established!");

    /** RabbitMQ connection */
    await rabbitWrapper.connect();

    httpServer.listen(port, () => {
      console.log(`Server is up and running on port ${port}`);
    });
  } catch (err) {
    console.log(err);
    return;
  }
};

void startService();

import { sequelize } from "./db/connect";
import { httpServer } from "./app";
import { client } from "./db/redis";
import { eventHandlers } from "./socketio/events";
import { User } from "./db/models/user";
import { rabbitWrapper } from "./rabbit-mq/connection";
import { subscribeToQeue } from "./rabbit-mq/subscriber";

let port = 4001;
if (process.env.PORT !== undefined) {
  port = Number.parseInt(process.env.PORT);
}
const startService = async (): Promise<void> => {
  try {
    eventHandlers();
    await client.connect();
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    /** Rabbitmq connection and subscription */
    await rabbitWrapper.connect();
    await subscribeToQeue("user_creation", "user");

    await User.create({
      bannedList: [],
      username: "shahab5191",
    });
    console.log("Connection to database has been established!");
    httpServer.listen(port, () => {
      console.log(`Server is up and running on port ${port}`);
    });
  } catch (err) {
    console.log(err);
    return;
  }
};

void startService();

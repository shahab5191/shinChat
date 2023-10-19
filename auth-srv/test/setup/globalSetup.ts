import { Sequelize } from "sequelize";
import config from "./config";
const url = `postgres://${config.POSTGRES_USERNAME}:${config.POSTGRES_PASSWORD}@${config.POSTGRES_ADDRESS}:${config.POSTGRES_PORT}`;
const sequelize = new Sequelize(url, { dialect: "postgres" });

export default async function globalSetup() {
  console.log(config);
  await sequelize.sync({ force: true });
}

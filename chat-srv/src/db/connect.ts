import dotenv from "dotenv";
import { Sequelize } from "sequelize";
dotenv.config();

const POSTGRES_USERNAME = process.env.POSTGRES_USERNAME;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const POSTGRES_ADDRESS = process.env.POSTGRES_ADDRESS;
const POSTGRES_PORT = process.env.POSTGRES_PORT;

if (
  POSTGRES_ADDRESS === undefined ||
  POSTGRES_PORT === undefined ||
  POSTGRES_USERNAME === undefined ||
  POSTGRES_PASSWORD === undefined
) {
  console.log("Postgress connection data is not available!");
  throw new Error("Postgress connection data is not available!");
}
const POSTGRES_URL = `postgres://${POSTGRES_USERNAME}:${POSTGRES_PASSWORD}@${POSTGRES_ADDRESS}:${POSTGRES_PORT}/chat`;
const sequelize = new Sequelize(POSTGRES_URL);
export { sequelize };

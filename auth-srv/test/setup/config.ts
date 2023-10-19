import dotenv from "dotenv";
dotenv.config();
export default {
  POSTGRES_ADDRESS: process.env.POSTGRES_ADDRESS,
  POSTGRES_USERNAME: process.env.POSTGRES_USERNAME,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_PORT: process.env.POSTGRES_PORT
};

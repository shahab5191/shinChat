import { createClient } from "redis";

const url = `redis://default:redispw@${process.env.POSTGRES_ADDRESS}:6379`
console.log({url})
const client = createClient({url});
client.on("error", (err) => {
  console.log(err);
  throw err;
});
export { client };

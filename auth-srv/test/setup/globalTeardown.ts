import { sequelize } from "../../src/db/connect";

export default async function () {
  console.log('global teardown ...')
}

import Request from "supertest";
import { httpServer } from "../../src/app";
import { createUser } from "./user-factory";

export const signup = async () => {
  const { email, password } = createUser();
  const response = await Request(httpServer)
    .post(`${process.env.URL_PREFIX}/users/signup`)
    .send({ email, password });
  if (response.status === 201) {
    if (response.body) {
      return { token: response.body.token, id: response.body.id };
    }
  }
  throw new Error("sign up failed");
};

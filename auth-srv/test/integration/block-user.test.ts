import Request from "supertest";
import { httpServer } from "../../src/app";
import { signup } from "../helper/signup";
describe("testing block functionality", function () {
  it("should block an existing user if requesting user is authenticated", async () => {
    const token = await signup()
    // const response = Request(httpServer).
    // // const response = Request(httpServer).get(`${process.env.URL_PREFIX}/users/blocks`).set('Authorization',`bearer ${token}`).send()
  });
});

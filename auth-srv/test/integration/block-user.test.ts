import Request from "supertest";
import { httpServer } from "../../src/app";
import { signup } from "../helper/signup";
import { sequelize } from "../../src/db/connect";
import crypto from "node:crypto";

const blockUser = async (id: string, token: string, expectedStatus: number) => {
  return await Request(httpServer)
    .patch(`${process.env.URL_PREFIX}/users/blocks/${id}`)
    .set("Authorization", `Bearer ${token}`)
    .send({})
    .expect(expectedStatus);
};

afterAll(async () => {
  await sequelize.close();
});

describe("testing block functionality", function () {
  beforeAll(async () => {
    try {
      await sequelize.authenticate();
    } catch (err) {
      console.log(err);
    }
  });
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  it("should block an existing user if requesting user is authenticated", async () => {
    const { token } = await signup();
    const { id: blockId } = await signup();
    const response = await blockUser(blockId, token, 201);
    expect(response.body).toHaveProperty("msg");
    expect(response.body.msg).toBe("User added to your block list!");
  });

  it("should return error message if blocking user does not exists", async () => {
    const { token } = await signup();
    const response = await blockUser(crypto.randomUUID(), token, 404);
    expect(response.body).toHaveProperty("err");
    expect(response.body.err).toBe("User was not found to block!");
  });

  it("should return error message if blocking user is same as requesting user", async () => {
    const { token, id } = await signup();
    const response = await blockUser(id, token, 403);
    expect(response.body).toHaveProperty("err");
    expect(response.body.err).toBe("You cannot block yourself!");
  });

  it("should return error message if user is not authenticated", async () => {
    const response = await blockUser("", "", 403);
    expect(response.body).toHaveProperty("err");
    expect(response.body.err).toBe("Unauthorized action");
  });

  it("should return bad request error if blocking id is not a valid uuid", async () => {
    const { token } = await signup();
    const response = await blockUser("test", token, 400);
    expect(response.body).toHaveProperty("err");
    expect(response.body.err).toBe("User id provided is not valid!");
  });
});

describe("testing get blocked list", () => {
  beforeAll(async () => {
    try {
      await sequelize.authenticate();
    } catch (err) {
      console.log(err);
    }
  });
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  it("should return list of blocked users", async () => {
    const { token } = await signup();
    const { id: user1 } = await signup();
    const { id: user2 } = await signup();

    const response1 = await blockUser(user1, token, 201);
    const response2 = await blockUser(user2, token, 201);

    const response = await Request(httpServer)
      .get(`${process.env.URL_PREFIX}/users/blocks`)
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .expect(200);
    expect(response.body).toHaveProperty("blockList");
    expect(response.body.blockList).toHaveLength(2)
    expect(response.body.blockList).toContain(user1)
    expect(response.body.blockList).toContain(user2)
  });
});

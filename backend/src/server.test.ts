import chai from "chai";
import supertest from "supertest";

import {closeMongo, connectToMongo} from "./dbUtils";
import {getBaseServer} from "./server";
import {User, UserDocument} from "./user";

const assert = chai.assert;

async function authAsUser(app: any, email: string, password: string): Promise<supertest.Agent> {
  const agent = supertest.agent(app);
  const res = await agent.post("/auth/login").send({email, password}).expect(200);
  agent.set("authorization", `Bearer ${res.body.data.token}`);
  return agent;
}

describe("server tests", () => {
  let app: any;
  let userAgent: supertest.Agent;

  beforeAll(async () => {
    process.env.TOKEN_SECRET = "test-secret-key-for-jwt";
    process.env.TOKEN_ISSUER = "test-issuer";
    process.env.REFRESH_TOKEN_SECRET = "test-refresh-secret";
    process.env.SESSION_SECRET = "test-session-secret";

    process.env.MONGODB_URI = "mongodb://localhost:27017/example-test";
    await connectToMongo();
    app = await getBaseServer(true);
  });

  beforeEach(async () => {
    await User.deleteMany({});

    await User.register(
      {name: "Admin User", email: "admin@example.com", admin: true} as UserDocument,
      "password"
    );

    await User.register(
      {name: "Regular User", email: "user@example.com", admin: false} as UserDocument,
      "password"
    );

    userAgent = await authAsUser(app, "admin@example.com", "password");
  });

  afterAll(async () => {
    await User.deleteMany({});
    await closeMongo();
  });

  it("lists users", async () => {
    const res = await userAgent.get("/users").expect(200);
    assert.lengthOf(res.body.data, 2);
  });

  it("health check works without authentication", async () => {
    const server = supertest(app);
    const res = await server.get("/health").expect(200);
    assert.deepEqual(res.body, {status: "ok"});
  });
});

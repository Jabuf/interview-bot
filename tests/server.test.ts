import { describe, test, expect } from "vitest";
import { fastify } from "../src/server.js";

describe("Fastify Server", () => {
  test("GET / should return API running message", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/"
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ message: "Interview Bot API is running!" });
  });
});

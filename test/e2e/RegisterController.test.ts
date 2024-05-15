import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";

import { registerPayloadSchema } from "@/adapters/controllers/auth/schemas/RegisterSchema";
import { RoleEnum } from "@/core/domain/enums/RoleEnum";
import { app } from "@/drivers/webserver/app";

type RegisterPayload = z.infer<typeof registerPayloadSchema>;

describe("Register Message Controller e2e", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should register a message", async () => {
    const createMessagePayload: RegisterPayload = {
      email: "jhon.doe@gmail.com",
      password: "123456",
      name: "Jhon Doe",
      role: RoleEnum.ADMIN,
      taxVat: "123456789",
    };

    const response = await request(app.server)
      .post("/user-service/register")
      .send(createMessagePayload);

    expect(response.status).toBe(201);
  });
});

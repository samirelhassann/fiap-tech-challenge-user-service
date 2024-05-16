import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";

import { registerPayloadSchema } from "@/adapters/controllers/auth/schemas/RegisterSchema";
import { RoleEnum } from "@/core/domain/enums/RoleEnum";
import { app } from "@/drivers/webserver/app";
import { faker } from "@faker-js/faker";

import { EXISTING_USER_EMAIL, EXISTING_USER_TAX_VAT } from "../constants";

type RegisterPayload = z.infer<typeof registerPayloadSchema>;

describe("Feature: User Registration", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("When a new user registers with valid details", () => {
    it("should respond with a 201 status indicating successful registration", async () => {
      const newUserDetails: RegisterPayload = {
        email: "jhon.doe@gmail.com",
        password: "123456",
        name: "Jhon Doe",
        role: RoleEnum.ADMIN,
        taxVat: "123456789",
      };

      const response = await request(app.server)
        .post("/user-service/register")
        .send(newUserDetails);

      expect(response.status).toBe(201);
    });
  });

  describe("When a user attempts to register with an email that already exists", () => {
    it("should respond with a 409 status indicating conflict error", async () => {
      const newUserDetails: RegisterPayload = {
        email: EXISTING_USER_EMAIL,
        password: faker.internet.password(),
        name: faker.person.firstName(),
        role: RoleEnum.CLIENT,
        taxVat: faker.string.numeric(11),
      };

      const response = await request(app.server)
        .post("/user-service/register")
        .send(newUserDetails);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: "please inform another email.",
      });
    });
  });

  describe("When a user attempts to register with a taxVat that already exists", () => {
    it("should respond with a 409 status indicating conflict error", async () => {
      const newUserDetails: RegisterPayload = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.person.firstName(),
        role: RoleEnum.CLIENT,
        taxVat: EXISTING_USER_TAX_VAT,
      };

      const response = await request(app.server)
        .post("/user-service/register")
        .send(newUserDetails);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: "please inform another taxVat.",
      });
    });
  });
});

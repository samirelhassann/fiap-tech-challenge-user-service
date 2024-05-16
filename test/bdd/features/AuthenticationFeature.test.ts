import request, { Response } from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/drivers/webserver/app";
import { faker } from "@faker-js/faker";

import { EXISTING_USER_EMAIL, EXISTING_USER_PASSWORD_HASH } from "../constants";

describe("Feature: User Authentication", () => {
  let userDetails: {
    email: string;
    password: string;
  } = {
    email: "",
    password: "",
  };

  let response: Response;

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  //  Scenario: Login with valid credentials
  //            Given I am a registered user
  //            When I try to log in
  //            Then I should be authenticated successfully
  describe("Scenario: Login with valid credentials", () => {
    it("Given I am a registered user", () => {
      userDetails = {
        email: EXISTING_USER_EMAIL,
        password: EXISTING_USER_PASSWORD_HASH,
      };
    });

    it("When I try to log in", async () => {
      response = await request(app.server)
        .post("/user-service/auth")
        .send(userDetails);
    });

    it("Then I should be authenticated successfully", async () => {
      expect(response.status).toBe(200);
    });
  });

  // Scenario: Login with invalid password
  // Given I am a registered user with an incorrect password
  // When I try to log in with the incorrect password
  // Then I should receive an invalid credentials error
  describe("Scenario: Login with invalid password", () => {
    it("Given I am a registered user with an incorrect password", () => {
      userDetails = {
        email: EXISTING_USER_EMAIL,
        password: faker.internet.password(),
      };
    });

    it("When I try to log in with the incorrect password", async () => {
      response = await request(app.server)
        .post("/user-service/auth")
        .send(userDetails);
    });

    it("Then I should receive an invalid credentials error", async () => {
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: "Invalid credentials",
      });
    });
  });
});

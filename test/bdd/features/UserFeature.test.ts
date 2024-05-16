import request, { Response } from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/drivers/webserver/app";

import { EXISTING_USER_ID } from "../constants";

describe("Feature: Retrieve a list of users", () => {
  let response: Response;

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  // Scenario: Retrieve a paginated list of users
  // When I request a paginated list of users
  // Then I should receive a paginated list of users
  describe("Scenario: Retrieve a paginated list of users", () => {
    it("When I request a paginated list of users", async () => {
      response = await request(app.server)
        .get("/user-service/users")
        .query({ page: 1, pageSize: 10 });
    });

    it("Then I should receive a paginated list of users", () => {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("pagination");
      expect(response.body).toHaveProperty("pagination.totalItems");
      expect(response.body).toHaveProperty("pagination.currentPage");
      expect(response.body).toHaveProperty("pagination.pageSize");
      expect(response.body).toHaveProperty("pagination.totalPages");
    });
  });

  // Scenario: Retrieve a user by a valid ID
  // When I request a user by a valid ID
  // Then I should receive the user details
  describe("Scenario: Retrieve a user by a valid ID", () => {
    it("When I request a user by a valid ID", async () => {
      response = await request(app.server)
        .get(`/user-service/users/${EXISTING_USER_ID}`) // Assuming '123' is a valid user ID for the test
        .send();
    });

    it("Then I should receive the user details", () => {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body.id).toBe(EXISTING_USER_ID);

      expect(response.body).toHaveProperty("name");
      expect(response.body).toHaveProperty("email");
      expect(response.body).toHaveProperty("taxVat");
      expect(response.body).toHaveProperty("createdAt");
      expect(response.body).toHaveProperty("updatedAt");
    });
  });

  // Scenario: Attempt to retrieve a user by an invalid ID
  // When I request a user by an invalid ID
  // Then I should receive a resource not found error
  describe("Scenario: Attempt to retrieve a user by an invalid ID", () => {
    it("When I request a user by an invalid ID", async () => {
      response = await request(app.server)
        .get("/user-service/users/invalid-id") // Assuming this is an invalid ID
        .send();
    });

    it("Then I should receive a resource not found error", () => {
      expect(response.status).toBe(404);
    });
  });
});

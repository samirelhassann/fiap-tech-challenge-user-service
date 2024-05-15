import { FastifyReply, FastifyRequest } from "fastify";
import { describe, expect, it, beforeEach, vi } from "vitest";

import { createUserPayloadSchema } from "@/adapters/controllers/user/schemas/CreateUserSchema";
import { CreateUserPresenter } from "@/adapters/presenters/user/CreateUserPresenter";
import { CreateUserUseCaseResponseDTO } from "@/core/useCases/user/dto/CreateUserUseCaseDTO";
import { faker } from "@faker-js/faker";
import { makeUser } from "@test/unit/factories/domain/MakeUser";

let req: FastifyRequest;
let res: FastifyReply;
let presenter: CreateUserPresenter;

describe("CreateUserPresenter", () => {
  const bodyMock = createUserPayloadSchema.parse({
    email: faker.internet.email(),
    name: faker.person.firstName(),
    taxVat: faker.string.numeric(11),
  });

  beforeEach(() => {
    req = {
      body: bodyMock,
    } as FastifyRequest;

    res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    } as unknown as FastifyReply;

    presenter = new CreateUserPresenter();
  });

  describe("convertToUseCaseDTO", () => {
    it("should convert request body to use case DTO", () => {
      const result = presenter.convertToUseCaseDTO(req);

      expect(result).toEqual({
        email: bodyMock.email,
        name: bodyMock.name,
        taxVat: bodyMock.taxVat,
      });
    });

    it("should handle invalid body and throw error", () => {
      req.body = {};

      expect(() => presenter.convertToUseCaseDTO(req)).toThrow();
    });
  });

  describe("sendResponse", () => {
    it("should send response with status 201", async () => {
      const useCaseResponse: CreateUserUseCaseResponseDTO = {
        user: makeUser(),
      };

      await presenter.sendResponse(res, useCaseResponse);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalled();
    });
  });
});

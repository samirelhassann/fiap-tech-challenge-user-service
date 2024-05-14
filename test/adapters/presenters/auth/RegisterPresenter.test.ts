import { FastifyReply, FastifyRequest } from "fastify";
import { describe, expect, it, beforeEach, vi } from "vitest";

import { registerPayloadSchema } from "@/adapters/controllers/auth/schemas/RegisterSchema";
import { RegisterPresenter } from "@/adapters/presenters/auth/RegisterPresenter";
import { RegisterUseCaseResponseDTO } from "@/core/useCases/auth/dto/RegisterUseCaseDTO";
import { faker } from "@faker-js/faker";

let req: FastifyRequest;
let res: FastifyReply;
let presenter: RegisterPresenter;

describe("RegisterPresenter", () => {
  const bodyMock = registerPayloadSchema.parse({
    name: faker.person.firstName(),
    taxVat: faker.string.numeric(11),
    role: "CLIENT",
    email: faker.internet.email(),
    password: faker.internet.password(8),
  });

  beforeEach(() => {
    req = {
      body: bodyMock,
    } as FastifyRequest;

    res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    } as unknown as FastifyReply;

    presenter = new RegisterPresenter();
  });
  describe("convertToUseCaseDTO", () => {
    it("should convert request body to use case DTO", () => {
      const result = presenter.convertToUseCaseDTO(req);

      expect(result).toEqual({
        email: bodyMock.email,
        password: bodyMock.password,
        name: bodyMock.name,
        taxVat: bodyMock.taxVat,
        role: bodyMock.role,
      });
    });

    it("should handle invalid body and throw error", () => {
      req.body = {};

      expect(() => presenter.convertToUseCaseDTO(req)).toThrow();
    });
  });

  describe("sendResponse", () => {
    it("should send response with status 201", async () => {
      const useCaseResponse: RegisterUseCaseResponseDTO = {};

      await presenter.sendResponse(res, useCaseResponse);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalled();
    });
  });
});

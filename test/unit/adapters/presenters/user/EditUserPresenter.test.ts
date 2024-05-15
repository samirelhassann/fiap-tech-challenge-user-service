import { FastifyReply, FastifyRequest } from "fastify";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { z } from "zod";

import {
  editUserPathParametersSchema,
  editUserPayloadSchema,
} from "@/adapters/controllers/user/schemas/EditUserSchema";
import { EditUserPresenter } from "@/adapters/presenters/user/EditUserPresenter";
import { EditUserUseCaseResponseDTO } from "@/core/useCases/user/dto/EditUserUseCaseDTO";
import { faker } from "@faker-js/faker";
import { makeUser } from "@test/unit/factories/domain/MakeUser";

vi.mock("@/adapters/controllers/user/schemas/EditUserSchema", () => ({
  editUserPathParametersSchema: z.object({
    id: z.string().uuid(),
  }),
  editUserPayloadSchema: z.object({
    email: z.string().email(),
    name: z.string().min(1),
  }),
}));

let req: FastifyRequest;
let res: FastifyReply;
let presenter: EditUserPresenter;

describe("EditUserPresenter", () => {
  const paramsMock = editUserPathParametersSchema.parse({
    id: faker.string.uuid(),
  });

  const bodyMock = editUserPayloadSchema.parse({
    email: faker.internet.email(),
    name: faker.person.firstName(),
  });

  beforeEach(() => {
    req = {
      params: paramsMock,
      body: bodyMock,
    } as FastifyRequest;

    res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    } as unknown as FastifyReply;

    presenter = new EditUserPresenter();
  });

  describe("convertToUseCaseDTO", () => {
    it("should convert request params and body to use case DTO", () => {
      const result = presenter.convertToUseCaseDTO(req);

      expect(result).toEqual({
        id: paramsMock.id,
        email: bodyMock.email,
        name: bodyMock.name,
        authUserId: req.userId,
      });
    });

    it("should handle invalid params or body and throw error", () => {
      req.params = {};
      req.body = {};

      expect(() => presenter.convertToUseCaseDTO(req)).toThrow();
    });
  });

  describe("convertToViewModel", () => {
    it("should convert use case response to view model", () => {
      const user = makeUser();
      const useCaseResponse: EditUserUseCaseResponseDTO = {
        user,
      };

      const result = presenter.convertToViewModel(useCaseResponse);

      expect(result).toEqual({
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        taxVat: user.taxVat.number,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
      });
    });
  });

  describe("sendResponse", () => {
    it("should send response with status 200", async () => {
      const user = makeUser();
      const useCaseResponse: EditUserUseCaseResponseDTO = {
        user,
      };

      await presenter.sendResponse(res, useCaseResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        taxVat: user.taxVat.number,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
      });
    });
  });
});

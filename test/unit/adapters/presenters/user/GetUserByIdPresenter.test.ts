import { FastifyReply, FastifyRequest } from "fastify";
import { describe, expect, it, beforeEach, vi } from "vitest";

import { getUserByIdQueryParamsSchema } from "@/adapters/controllers/user/schemas/GetUserByIdSchema";
import { GetUserByIdPresenter } from "@/adapters/presenters/user/GetUserByIdPresenter";
import { GetUserByIdUseCaseResponseDTO } from "@/core/useCases/user/dto/GetUserByIdUseCaseDTO";
import { faker } from "@faker-js/faker";
import { makeUser } from "@test/unit/factories/domain/MakeUser";

let req: FastifyRequest;
let res: FastifyReply;
let presenter: GetUserByIdPresenter;

describe("GetUserByIdPresenter", () => {
  const mockedId = faker.number.int().toString();

  beforeEach(() => {
    const params = getUserByIdQueryParamsSchema.parse({
      id: mockedId,
    });

    req = {
      params,
    } as FastifyRequest;

    res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    } as unknown as FastifyReply;

    presenter = new GetUserByIdPresenter();
  });
  describe("convertToUseCaseDTO", () => {
    it("should convert request params to use case DTO", () => {
      const result = presenter.convertToUseCaseDTO(req);

      expect(result).toEqual({
        id: mockedId,
      });
    });

    it("should handle invalid params and throw error", () => {
      req.params = {};

      expect(() => presenter.convertToUseCaseDTO(req)).toThrow();
    });
  });

  describe("convertToViewModel", () => {
    it("should convert use case response to view model", () => {
      const user = makeUser();
      const useCaseResponse: GetUserByIdUseCaseResponseDTO = {
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
      const useCaseResponse: GetUserByIdUseCaseResponseDTO = {
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

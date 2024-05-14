import { FastifyReply, FastifyRequest } from "fastify";
import { describe, expect, it, beforeEach, vi } from "vitest";

import { checkUserByTaxvatQueryParamsSchema } from "@/adapters/controllers/user/schemas/CheckUserByTaxvatSchema";
import { CheckUserByTaxvatPresenter } from "@/adapters/presenters/user/CheckUserByTaxvatPresenter";
import { CheckUserByTaxvatUseCaseResponseDTO } from "@/core/useCases/user/dto/CheckUserByTaxvatUseCaseDTO";
import { faker } from "@faker-js/faker";

let req: FastifyRequest;
let res: FastifyReply;
let presenter: CheckUserByTaxvatPresenter;

describe("CheckUserByTaxvatPresenter", () => {
  const mockedTaxvat = faker.string.numeric(11);

  const queryMock = checkUserByTaxvatQueryParamsSchema.parse({
    taxvat: mockedTaxvat,
  });

  beforeEach(() => {
    req = {
      query: queryMock,
    } as FastifyRequest;

    res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    } as unknown as FastifyReply;

    presenter = new CheckUserByTaxvatPresenter();
  });

  describe("convertToUseCaseDTO", () => {
    it("should convert request query params to use case DTO", () => {
      const result = presenter.convertToUseCaseDTO(req);

      expect(result).toEqual({
        taxvat: mockedTaxvat,
      });
    });

    it("should handle invalid params and throw error", () => {
      req.query = {};

      expect(() => presenter.convertToUseCaseDTO(req)).toThrow();
    });
  });

  describe("convertToViewModel", () => {
    it("should convert use case response to view model", () => {
      const useCaseResponse: CheckUserByTaxvatUseCaseResponseDTO = {
        exist: faker.datatype.boolean(),
      };

      const result = presenter.convertToViewModel(useCaseResponse);

      expect(result).toEqual({
        exist: useCaseResponse.exist,
      });
    });
  });

  describe("sendResponse", () => {
    it("should send response with status 200", async () => {
      const useCaseResponse: CheckUserByTaxvatUseCaseResponseDTO = {
        exist: faker.datatype.boolean(),
      };

      await presenter.sendResponse(res, useCaseResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        exist: useCaseResponse.exist,
      });
    });
  });
});

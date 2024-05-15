import { FastifyReply, FastifyRequest } from "fastify";
import { describe, expect, it, beforeEach, vi } from "vitest";

import { getUsersQueryParamsSchema } from "@/adapters/controllers/user/schemas/GetUsersSchema";
import { GetUsersPresenter } from "@/adapters/presenters/user/GetUsersPresenter";
import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { PaginationResponse } from "@/core/domain/base/PaginationResponse";
import { User } from "@/core/domain/entities/User";
import { GetUsersUseCaseResponseDTO } from "@/core/useCases/user/dto/GetUsersUseCaseDTO";
import { faker } from "@faker-js/faker";
import { makeUser } from "@test/unit/factories/domain/MakeUser";

let req: FastifyRequest;
let res: FastifyReply;
let presenter: GetUsersPresenter;

beforeEach(() => {
  const query = getUsersQueryParamsSchema.parse({
    page: 1,
    pageSize: 10,
  });

  req = {
    query,
  } as FastifyRequest;

  res = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  } as unknown as FastifyReply;

  presenter = new GetUsersPresenter();
});

describe("GetUsersPresenter", () => {
  describe("convertToUseCaseDTO", () => {
    it("should convert request query params to use case DTO", () => {
      const result = presenter.convertToUseCaseDTO(req);

      expect(result).toEqual({
        params: new PaginationParams(1, 10),
      });
    });

    it("should handle default values if query params are not provided", () => {
      req.query = {};

      const result = presenter.convertToUseCaseDTO(req);

      expect(result).toEqual({
        params: new PaginationParams(1, 20),
      });
    });
  });

  describe("convertToViewModel", () => {
    it("should convert use case response to view model", () => {
      const mockedPaginationResponse = new PaginationResponse<User>({
        currentPage: faker.number.int(),
        data: [makeUser()],
        pageSize: faker.number.int(),
        totalItems: faker.number.int(),
        totalPages: faker.number.int(),
      });

      const useCaseResponse: GetUsersUseCaseResponseDTO = {
        paginationResponse: mockedPaginationResponse,
      };

      const result = presenter.convertToViewModel(useCaseResponse);

      expect(result).toEqual(
        mockedPaginationResponse.toResponse((item) => ({
          id: item.id.toString(),
          name: item.name,
          email: item.email,
          taxVat: item.taxVat.number,
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt?.toISOString(),
        }))
      );
    });
  });

  describe("sendResponse", () => {
    it("should send response with status 200", async () => {
      const mockedPaginationResponse = new PaginationResponse<User>({
        currentPage: faker.number.int(),
        data: [makeUser()],
        pageSize: faker.number.int(),
        totalItems: faker.number.int(),
        totalPages: faker.number.int(),
      });

      const useCaseResponse: GetUsersUseCaseResponseDTO = {
        paginationResponse: mockedPaginationResponse,
      };

      await presenter.sendResponse(res, useCaseResponse);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        mockedPaginationResponse.toResponse((item) => ({
          id: item.id.toString(),
          name: item.name,
          email: item.email,
          taxVat: item.taxVat.number,
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt?.toISOString(),
        }))
      );
    });
  });
});

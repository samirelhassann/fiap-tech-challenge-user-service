import { FastifyReply, FastifyRequest } from "fastify";
import { describe, expect, it, beforeEach, vi } from "vitest";

import { UserController } from "@/adapters/controllers/user/UserController";
import { CheckUserByTaxvatPresenter } from "@/adapters/presenters/user/CheckUserByTaxvatPresenter";
import { EditUserPresenter } from "@/adapters/presenters/user/EditUserPresenter";
import { GetUserByIdPresenter } from "@/adapters/presenters/user/GetUserByIdPresenter";
import { GetUsersPresenter } from "@/adapters/presenters/user/GetUsersPresenter";
import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { PaginationResponse } from "@/core/domain/base/PaginationResponse";
import {
  CheckUserByTaxvatUseCaseRequestDTO,
  CheckUserByTaxvatUseCaseResponseDTO,
} from "@/core/useCases/user/dto/CheckUserByTaxvatUseCaseDTO";
import {
  EditUserUseCaseRequestDTO,
  EditUserUseCaseResponseDTO,
} from "@/core/useCases/user/dto/EditUserUseCaseDTO";
import {
  GetUserByIdUseCaseRequestDTO,
  GetUserByIdUseCaseResponseDTO,
} from "@/core/useCases/user/dto/GetUserByIdUseCaseDTO";
import {
  GetUsersUseCaseRequestDTO,
  GetUsersUseCaseResponseDTO,
} from "@/core/useCases/user/dto/GetUsersUseCaseDTO";
import { IUserUseCase } from "@/core/useCases/user/IUserUseCase";
import { faker } from "@faker-js/faker";
import { makeUser } from "@test/unit/factories/domain/MakeUser";

let req: FastifyRequest;
let res: FastifyReply;
let controller: UserController;
let userUseCase: IUserUseCase;
let getUsersPresenter: GetUsersPresenter;
let getUserByIdPresenter: GetUserByIdPresenter;
let editUserPresenter: EditUserPresenter;
let checkUserByTaxvatPresenter: CheckUserByTaxvatPresenter;

beforeEach(() => {
  userUseCase = {
    getUsers: vi.fn(),
    getUserById: vi.fn(),
    editUser: vi.fn(),
    checkByTaxvat: vi.fn(),
  };

  getUsersPresenter = {
    convertToViewModel: vi.fn(),
    convertToUseCaseDTO: vi.fn(),
    sendResponse: vi.fn(),
    convertErrorResponse: vi.fn(),
  };

  getUserByIdPresenter = {
    convertToViewModel: vi.fn(),
    convertToUseCaseDTO: vi.fn(),
    sendResponse: vi.fn(),
    convertErrorResponse: vi.fn(),
  };

  editUserPresenter = {
    convertToViewModel: vi.fn(),
    convertToUseCaseDTO: vi.fn(),
    sendResponse: vi.fn(),
    convertErrorResponse: vi.fn(),
  };

  checkUserByTaxvatPresenter = {
    convertToViewModel: vi.fn(),
    convertToUseCaseDTO: vi.fn(),
    sendResponse: vi.fn(),
    convertErrorResponse: vi.fn(),
  };

  controller = new UserController(
    userUseCase,
    getUsersPresenter,
    getUserByIdPresenter,
    editUserPresenter,
    checkUserByTaxvatPresenter
  );

  req = {} as FastifyRequest;
  res = {
    code: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  } as unknown as FastifyReply;
});

describe("UserController", () => {
  describe("getUsers", () => {
    it("should call getUsers use case and send response", async () => {
      const useCaseRequest: GetUsersUseCaseRequestDTO = {
        params: new PaginationParams(faker.number.int(), faker.number.int()),
      };
      const mockedUser = makeUser();
      const useCaseResponse: GetUsersUseCaseResponseDTO = {
        paginationResponse: new PaginationResponse({
          currentPage: faker.number.int(),
          data: [mockedUser],
          pageSize: faker.number.int(),
          totalItems: faker.number.int(),
          totalPages: faker.number.int(),
        }),
      };

      vi.spyOn(getUsersPresenter, "convertToUseCaseDTO").mockReturnValueOnce(
        useCaseRequest
      );
      vi.spyOn(userUseCase, "getUsers").mockResolvedValueOnce(useCaseResponse);

      await controller.getUsers(req, res);

      expect(userUseCase.getUsers).toHaveBeenCalled();
      expect(getUsersPresenter.sendResponse).toHaveBeenCalledWith(
        res,
        useCaseResponse
      );
    });

    it("should handle errors and send error response", async () => {
      const error = new Error();
      vi.spyOn(userUseCase, "getUsers").mockRejectedValueOnce(error);

      await controller.getUsers(req, res);

      expect(getUsersPresenter.convertErrorResponse).toHaveBeenCalledWith(
        error,
        res
      );
    });
  });

  describe("checkUserByTaxvat", () => {
    it("should call checkUserByTaxvat use case and send response", async () => {
      const useCaseRequest: CheckUserByTaxvatUseCaseRequestDTO = {
        taxvat: faker.string.numeric(11),
      };
      const useCaseResponse: CheckUserByTaxvatUseCaseResponseDTO = {
        exist: faker.datatype.boolean(),
      };

      vi.spyOn(
        checkUserByTaxvatPresenter,
        "convertToUseCaseDTO"
      ).mockReturnValueOnce(useCaseRequest);
      vi.spyOn(userUseCase, "checkByTaxvat").mockResolvedValueOnce(
        useCaseResponse
      );

      await controller.checkUserByTaxvat(req, res);

      expect(userUseCase.checkByTaxvat).toHaveBeenCalled();
      expect(checkUserByTaxvatPresenter.sendResponse).toHaveBeenCalledWith(
        res,
        useCaseResponse
      );
    });

    it("should handle errors and send error response", async () => {
      const error = new Error();
      vi.spyOn(userUseCase, "checkByTaxvat").mockRejectedValueOnce(error);

      await controller.checkUserByTaxvat(req, res);

      expect(
        checkUserByTaxvatPresenter.convertErrorResponse
      ).toHaveBeenCalledWith(error, res);
    });
  });

  describe("getUserById", () => {
    it("should call getUserById use case and send response", async () => {
      const useCaseRequest: GetUserByIdUseCaseRequestDTO = {
        id: faker.string.numeric(),
      };
      const useCaseResponse: GetUserByIdUseCaseResponseDTO = {
        user: makeUser(),
      };

      vi.spyOn(getUserByIdPresenter, "convertToUseCaseDTO").mockReturnValueOnce(
        useCaseRequest
      );
      vi.spyOn(userUseCase, "getUserById").mockResolvedValueOnce(
        useCaseResponse
      );

      await controller.getUserById(req, res);

      expect(userUseCase.getUserById).toHaveBeenCalled();
      expect(getUserByIdPresenter.sendResponse).toHaveBeenCalledWith(
        res,
        useCaseResponse
      );
    });

    it("should handle errors and send error response", async () => {
      const error = new Error();
      vi.spyOn(userUseCase, "getUserById").mockRejectedValueOnce(error);

      await controller.getUserById(req, res);

      expect(getUserByIdPresenter.convertErrorResponse).toHaveBeenCalledWith(
        error,
        res
      );
    });
  });

  describe("editUser", () => {
    it("should call editUser use case and send response", async () => {
      const useCaseRequest: EditUserUseCaseRequestDTO = {
        id: faker.string.numeric(),
        authUserId: faker.string.numeric(),
        name: faker.person.fullName(),
      };
      const useCaseResponse: EditUserUseCaseResponseDTO = {
        user: makeUser(),
      };

      vi.spyOn(userUseCase, "editUser").mockResolvedValueOnce(useCaseResponse);
      vi.spyOn(editUserPresenter, "convertToUseCaseDTO").mockReturnValueOnce(
        useCaseRequest
      );

      await controller.editUser(req, res);

      expect(userUseCase.editUser).toHaveBeenCalled();
      expect(editUserPresenter.sendResponse).toHaveBeenCalledWith(
        res,
        useCaseResponse
      );
    });

    it("should handle errors and send error response", async () => {
      const error = new Error();
      vi.spyOn(userUseCase, "editUser").mockRejectedValueOnce(error);

      await controller.editUser(req, res);

      expect(editUserPresenter.convertErrorResponse).toHaveBeenCalledWith(
        error,
        res
      );
    });
  });
});

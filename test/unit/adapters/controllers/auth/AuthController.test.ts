import { FastifyReply, FastifyRequest } from "fastify";
import { describe, expect, it, beforeEach, vi } from "vitest";

import { AuthController } from "@/adapters/controllers/auth/AuthController";
import { AuthenticatePresenter } from "@/adapters/presenters/auth/AuthenticatePresenter";
import { RegisterPresenter } from "@/adapters/presenters/auth/RegisterPresenter";
import { RoleEnum } from "@/core/domain/enums/RoleEnum";
import {
  AuthenticateUseCaseRequestDTO,
  AuthenticateUseCaseResponseDTO,
} from "@/core/useCases/auth/dto/AuthenticateUseCaseDTO";
import {
  RegisterUseCaseRequestDTO,
  RegisterUseCaseResponseDTO,
} from "@/core/useCases/auth/dto/RegisterUseCaseDTO";
import { IAuthUseCase } from "@/core/useCases/auth/IAuthUseCase";
import { faker } from "@faker-js/faker";
import { getRandomEnumValue } from "@test/unit/utils/GetRandomEnumValue";

let req: FastifyRequest;
let res: FastifyReply;
let authController: AuthController;
let authUseCase: IAuthUseCase;
let registerPresenter: RegisterPresenter;
let authenticatePresenter: AuthenticatePresenter;

beforeEach(() => {
  authUseCase = {
    register: vi.fn(),
    authenticate: vi.fn(),
  };

  registerPresenter = {
    convertToUseCaseDTO: vi.fn(),
    sendResponse: vi.fn(),
    convertErrorResponse: vi.fn(),
  };

  authenticatePresenter = {
    convertToUseCaseDTO: vi.fn(),
    sendResponse: vi.fn(),
    convertErrorResponse: vi.fn(),
  };

  authController = new AuthController(
    authUseCase,
    registerPresenter,
    authenticatePresenter
  );

  req = {} as FastifyRequest;
  res = {
    code: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  } as unknown as FastifyReply;
});

describe("AuthController", () => {
  describe("register", () => {
    it("should call register use case and send response", async () => {
      const useCaseRequest: RegisterUseCaseRequestDTO = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        taxVat: faker.string.alphanumeric(11),
        password: faker.internet.password(),
        role: getRandomEnumValue(RoleEnum),
      };
      const useCaseResponse: RegisterUseCaseResponseDTO = {};

      vi.spyOn(registerPresenter, "convertToUseCaseDTO").mockReturnValueOnce(
        useCaseRequest
      );
      vi.spyOn(authUseCase, "register").mockResolvedValueOnce(useCaseResponse);

      await authController.register(req, res);

      expect(authUseCase.register).toHaveBeenCalledWith(useCaseRequest);
      expect(registerPresenter.sendResponse).toHaveBeenCalledWith(
        res,
        useCaseResponse
      );
    });

    it("should handle errors and send error response", async () => {
      const error = new Error("Register error");
      vi.spyOn(authUseCase, "register").mockRejectedValueOnce(error);

      await authController.register(req, res);

      expect(registerPresenter.convertErrorResponse).toHaveBeenCalledWith(
        error,
        res
      );
    });
  });

  describe("authenticate", () => {
    it("should call authenticate use case and send response", async () => {
      const useCaseRequest: AuthenticateUseCaseRequestDTO = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const useCaseResponse: AuthenticateUseCaseResponseDTO = {
        role: getRandomEnumValue(RoleEnum),
        userId: faker.string.numeric(),
      };

      vi.spyOn(
        authenticatePresenter,
        "convertToUseCaseDTO"
      ).mockReturnValueOnce(useCaseRequest);
      vi.spyOn(authUseCase, "authenticate").mockResolvedValueOnce(
        useCaseResponse
      );

      await authController.authenticate(req, res);

      expect(authUseCase.authenticate).toHaveBeenCalledWith(useCaseRequest);
      expect(authenticatePresenter.sendResponse).toHaveBeenCalledWith(
        res,
        useCaseResponse
      );
    });

    it("should handle errors and send error response", async () => {
      const error = new Error("Authenticate error");
      vi.spyOn(authUseCase, "authenticate").mockRejectedValueOnce(error);

      await authController.authenticate(req, res);

      expect(authenticatePresenter.convertErrorResponse).toHaveBeenCalledWith(
        error,
        res
      );
    });
  });
});

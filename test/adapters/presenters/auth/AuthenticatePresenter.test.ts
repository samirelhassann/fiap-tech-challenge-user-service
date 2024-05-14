import { FastifyReply, FastifyRequest } from "fastify";
import { describe, expect, it, beforeEach, vi } from "vitest";

import { authenticatePayloadSchema } from "@/adapters/controllers/auth/schemas/AuthenticateSchema";
import { AuthenticatePresenter } from "@/adapters/presenters/auth/AuthenticatePresenter";
import { AuthenticateUseCaseResponseDTO } from "@/core/useCases/auth/dto/AuthenticateUseCaseDTO";
import { faker } from "@faker-js/faker";

let req: FastifyRequest;
let res: FastifyReply;
let presenter: AuthenticatePresenter;

describe("AuthenticatePresenter", () => {
  const bodyMock = authenticatePayloadSchema.parse({
    email: faker.internet.email(),
    password: faker.internet.password(),
  });

  beforeEach(() => {
    req = {
      body: bodyMock,
    } as FastifyRequest;

    res = {
      jwtSign: vi.fn(),
      setCookie: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    } as unknown as FastifyReply;

    presenter = new AuthenticatePresenter();
  });

  describe("convertToUseCaseDTO", () => {
    it("should convert request body to use case DTO", () => {
      const result = presenter.convertToUseCaseDTO(req);

      expect(result).toEqual({
        email: bodyMock.email,
        password: bodyMock.password,
      });
    });

    it("should handle invalid body and throw error", () => {
      req.body = {};

      expect(() => presenter.convertToUseCaseDTO(req)).toThrow();
    });
  });

  describe("sendResponse", () => {
    it("should send response with token and set refresh token cookie", async () => {
      const useCaseResponse: AuthenticateUseCaseResponseDTO = {
        userId: faker.string.uuid(),
        role: "USER",
      };

      const token = faker.string.alphanumeric();
      const refreshToken = faker.string.uuid();

      vi.mocked(res.jwtSign)
        .mockResolvedValueOnce(token)
        .mockResolvedValueOnce(refreshToken);

      await presenter.sendResponse(res, useCaseResponse);

      expect(res.jwtSign).toHaveBeenCalledWith(
        { role: useCaseResponse.role },
        { sign: { sub: useCaseResponse.userId } }
      );
      expect(res.jwtSign).toHaveBeenCalledWith(
        { role: useCaseResponse.role },
        { sign: { sub: useCaseResponse.userId, expiresIn: "1d" } }
      );
      expect(res.setCookie).toHaveBeenCalledWith("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ token });
    });
  });
});

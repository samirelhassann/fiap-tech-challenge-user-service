import { describe, it, expect, beforeEach, vi } from "vitest";

import { InvalidCredentialsError } from "@/core/domain/base/errors/useCases/InvalidCredentialsError";
import { Password } from "@/core/domain/valueObjects/Password";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import { AuthUseCase } from "@/core/useCases/auth/AuthUseCase";
import {
  AuthenticateUseCaseRequestDTO,
  AuthenticateUseCaseResponseDTO,
} from "@/core/useCases/auth/dto/AuthenticateUseCaseDTO";
import { IAuthUseCase } from "@/core/useCases/auth/IAuthUseCase";
import { makeUser } from "@test/unit/factories/domain/MakeUser";

let userRepository: IUserRepository;
let sut: IAuthUseCase;

describe("AuthenticateUseCase", () => {
  beforeEach(() => {
    userRepository = {
      findByEmail: vi.fn(),
    } as unknown as IUserRepository;

    sut = new AuthUseCase(userRepository);
  });

  it("should authenticate the user with valid credentials", async () => {
    const password = "validPassword123";
    const userMock = makeUser({
      passwordHash: new Password({
        value: Password.valueToHash(password),
      }),
    });

    const request: AuthenticateUseCaseRequestDTO = {
      email: userMock.email,
      password,
    };

    vi.mocked(userRepository.findByEmail).mockResolvedValueOnce(userMock);

    const response: AuthenticateUseCaseResponseDTO = {
      role: userMock.role.name,
      userId: userMock.id.toValue(),
    };

    const result = await sut.authenticate(request);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(userMock.email);
    expect(result).toEqual(response);
  });

  it("should throw InvalidCredentialsError when email is not found", async () => {
    const request: AuthenticateUseCaseRequestDTO = {
      email: "nonexistent@example.com",
      password: "anyPassword",
    };

    vi.mocked(userRepository.findByEmail).mockResolvedValueOnce(null);

    await expect(() => sut.authenticate(request)).rejects.toThrow(
      InvalidCredentialsError
    );
  });

  it("should throw InvalidCredentialsError when password is incorrect", async () => {
    const userMock = makeUser({
      passwordHash: new Password({
        value: Password.valueToHash("validPassword123"),
      }),
    });

    const request: AuthenticateUseCaseRequestDTO = {
      email: userMock.email,
      password: "wrongPassword",
    };

    vi.mocked(userRepository.findByEmail).mockResolvedValueOnce(userMock);

    await expect(() => sut.authenticate(request)).rejects.toThrow(
      InvalidCredentialsError
    );
  });
});

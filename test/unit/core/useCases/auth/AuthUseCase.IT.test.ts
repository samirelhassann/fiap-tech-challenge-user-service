import { beforeEach, describe, expect, it, vi } from "vitest";

import { InvalidCredentialsError } from "@/core/domain/base/errors/useCases/InvalidCredentialsError";
import { Password } from "@/core/domain/valueObjects/Password";
import { AuthUseCase } from "@/core/useCases/auth/AuthUseCase";
import { IAuthUseCase } from "@/core/useCases/auth/IAuthUseCase";
import { InMemoryUserRepository } from "@test/unit/adapters/InMemoryUserRepository";
import { makeUser } from "@test/unit/factories/domain/MakeUser";

let inMemoryUsersRepository: InMemoryUserRepository;
let sut: IAuthUseCase;

describe("AuthenticateUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    inMemoryUsersRepository = new InMemoryUserRepository();
    sut = new AuthUseCase(inMemoryUsersRepository);
  });

  it("should authenticate the user with valid credentials", async () => {
    const userMock = makeUser({
      passwordHash: new Password({
        value: Password.valueToHash("validPassword123"),
      }),
    });
    inMemoryUsersRepository.items.push(userMock);

    const request = {
      email: userMock.email,
      password: "validPassword123",
    };

    const response = await sut.authenticate(request);

    expect(response).toEqual({
      role: userMock.role.name,
      userId: userMock.id.toValue(),
    });
  });

  it("should throw InvalidCredentialsError when email is not found", async () => {
    const request = {
      email: "nonexistent@example.com",
      password: "anyPassword",
    };

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
    inMemoryUsersRepository.items.push(userMock);

    const request = {
      email: userMock.email,
      password: "wrongPassword",
    };

    await expect(() => sut.authenticate(request)).rejects.toThrow(
      InvalidCredentialsError
    );
  });
});

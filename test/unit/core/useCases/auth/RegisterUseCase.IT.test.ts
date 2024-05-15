import { beforeEach, describe, expect, it, vi } from "vitest";

import { AttributeConflictError } from "@/core/domain/base/errors/useCases/AttributeConflictError";
import { RoleEnum } from "@/core/domain/enums/RoleEnum";
import { AuthUseCase } from "@/core/useCases/auth/AuthUseCase";
import { IAuthUseCase } from "@/core/useCases/auth/IAuthUseCase";
import { InMemoryUserRepository } from "@test/unit/adapters/InMemoryUserRepository";
import { makeUser } from "@test/unit/factories/domain/MakeUser";

let inMemoryUsersRepository: InMemoryUserRepository;
let sut: IAuthUseCase;

describe("RegisterUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    inMemoryUsersRepository = new InMemoryUserRepository();
    sut = new AuthUseCase(inMemoryUsersRepository);
  });

  it("should register a new user when the provided data is valid", async () => {
    const userMock = makeUser();

    const request = {
      taxVat: userMock.taxVat.number,
      name: userMock.name,
      email: userMock.email,
      password: "validPassword123",
      role: userMock.role.name,
    };

    await sut.register(request);

    const createdUser = inMemoryUsersRepository.items.find(
      (user) => user.email === request.email
    );

    expect(createdUser).toBeDefined();
    expect(createdUser?.name).toBe(request.name);
    expect(createdUser?.email).toBe(request.email);
  });

  it("should throw AttributeConflictError when taxVat is already taken", async () => {
    const existingUser = makeUser();
    inMemoryUsersRepository.items.push(existingUser);

    const request = {
      taxVat: existingUser.taxVat.number,
      name: "New User",
      email: "new@example.com",
      password: "validPassword123",
      role: RoleEnum.ADMIN,
    };

    await expect(() => sut.register(request)).rejects.toThrow(
      AttributeConflictError
    );
  });

  it("should throw AttributeConflictError when email is already taken", async () => {
    const existingUser = makeUser();
    inMemoryUsersRepository.items.push(existingUser);

    const request = {
      taxVat: "new-taxvat",
      name: "New User",
      email: existingUser.email,
      password: "validPassword123",
      role: RoleEnum.ADMIN,
    };

    await expect(() => sut.register(request)).rejects.toThrow(
      AttributeConflictError
    );
  });
});

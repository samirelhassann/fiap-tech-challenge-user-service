import { beforeEach, describe, expect, it, vi } from "vitest";

import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { IUserUseCase } from "@/core/useCases/user/IUserUseCase";
import { UserUseCase } from "@/core/useCases/user/UserUseCase";
import { InMemoryUserRepository } from "@test/unit/adapters/InMemoryUserRepository";
import { makeUser } from "@test/unit/factories/domain/MakeUser";

let inMemoryUsersRepository: InMemoryUserRepository;
let sut: IUserUseCase;

describe("Given the Get Users Use Case", () => {
  const page = 1;
  const size = 10;

  beforeEach(() => {
    vi.clearAllMocks();
    inMemoryUsersRepository = new InMemoryUserRepository();

    sut = new UserUseCase(inMemoryUsersRepository);
  });

  it("should return the users correctly", async () => {
    const params = new PaginationParams(page, size);
    const userToCreate = makeUser();
    inMemoryUsersRepository.items.push(userToCreate);

    const { paginationResponse } = await sut.getUsers({ params });
    const users = paginationResponse.data;

    expect(users).toHaveLength(1);
  });

  it("should return the users from the second pagination correctly", async () => {
    const params = new PaginationParams(2, size);
    Array.from({ length: 12 }).forEach(() => {
      inMemoryUsersRepository.items.push(makeUser());
    });

    const { paginationResponse } = await sut.getUsers({ params });
    const users = paginationResponse.data;

    expect(users).toHaveLength(2);
  });
});

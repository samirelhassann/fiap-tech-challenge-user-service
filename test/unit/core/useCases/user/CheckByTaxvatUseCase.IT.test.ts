import { beforeEach, describe, expect, it, vi } from "vitest";

import { UserUseCase } from "@/core/useCases/user/UserUseCase";
import { InMemoryUserRepository } from "@test/unit/adapters/InMemoryUserRepository";
import { makeUser } from "@test/unit/factories/domain/MakeUser";

let inMemoryUsersRepository: InMemoryUserRepository;
let sut: UserUseCase;

describe("Given the Check By Taxvat Use Case", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    inMemoryUsersRepository = new InMemoryUserRepository();

    sut = new UserUseCase(inMemoryUsersRepository);
  });

  it("should check the taxvat correctly", async () => {
    const userToCreate = makeUser();
    inMemoryUsersRepository.items.push(userToCreate);

    const taxvat = userToCreate.taxVat.number;

    const { exist } = await sut.checkByTaxvat({ taxvat });

    expect(exist).toBe(true);
  });

  it("should return correctly when there is no user with the requested taxvat", async () => {
    const userToCreate = makeUser();
    inMemoryUsersRepository.items.push(userToCreate);

    const taxvat = "123";

    const { exist } = await sut.checkByTaxvat({ taxvat });

    expect(exist).toBe(false);
  });
});

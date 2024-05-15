import { beforeEach, describe, expect, it, vi } from "vitest";

import { UniqueEntityId } from "@/core/domain/base/entities/UniqueEntityId";
import { ResourceNotFoundError } from "@/core/domain/base/errors/useCases/ResourceNotFoundError";
import { UserUseCase } from "@/core/useCases/user/UserUseCase";
import { InMemoryUserRepository } from "@test/unit/adapters/InMemoryUserRepository";
import { makeUser } from "@test/unit/factories/domain/MakeUser";

let inMemoryUsersRepository: InMemoryUserRepository;
let sut: UserUseCase;

describe("Given the Get Users By Id Use Case", () => {
  const id = "123";

  beforeEach(() => {
    vi.clearAllMocks();

    inMemoryUsersRepository = new InMemoryUserRepository();

    sut = new UserUseCase(inMemoryUsersRepository);
  });

  it("should return the user correctly", async () => {
    const user = makeUser({}, new UniqueEntityId(id));

    inMemoryUsersRepository.items.push(user);

    const { user: foundedUser } = await sut.getUserById({ id });

    expect(foundedUser).toEqual(
      expect.objectContaining({
        id: new UniqueEntityId(id),
      })
    );
  });

  it("should throw an error when the informed id does not exist", async () => {
    const user = makeUser({}, new UniqueEntityId(id));

    inMemoryUsersRepository.items.push(user);

    await expect(() => sut.getUserById({ id: "456" })).rejects.toBeInstanceOf(
      ResourceNotFoundError
    );
  });
});

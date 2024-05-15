import { beforeEach, describe, expect, it, vi } from "vitest";

import { AttributeConflictError } from "@/core/domain/base/errors/useCases/AttributeConflictError";
import { InvalidCredentialsError } from "@/core/domain/base/errors/useCases/InvalidCredentialsError";
import { ResourceNotFoundError } from "@/core/domain/base/errors/useCases/ResourceNotFoundError";
import { EditUserUseCase } from "@/core/useCases/user/implementations/EditUserUseCase";
import { InMemoryUserRepository } from "@test/unit/adapters/InMemoryUserRepository";
import { makeUser } from "@test/unit/factories/domain/MakeUser";

let inMemoryUsersRepository: InMemoryUserRepository;
let sut: EditUserUseCase;

describe("EditUserUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    inMemoryUsersRepository = new InMemoryUserRepository();
    sut = new EditUserUseCase(inMemoryUsersRepository);
  });

  it("should update the user when the provided data is valid", async () => {
    const userToCreate = makeUser();
    inMemoryUsersRepository.items.push(userToCreate);

    const updatedUserMock = {
      ...userToCreate,
      name: "Updated Name",
      email: "updated@example.com",
    };

    const request = {
      id: userToCreate.id.toString(),
      email: updatedUserMock.email,
      name: updatedUserMock.name,
      authUserId: userToCreate.id.toString(),
    };

    const response = await sut.execute(request);

    expect(response.user.name).toBe(updatedUserMock.name);
    expect(response.user.email).toBe(updatedUserMock.email);
  });

  it("should throw InvalidCredentialsError when authUserId is not provided", async () => {
    const userToCreate = makeUser();
    inMemoryUsersRepository.items.push(userToCreate);

    const request = {
      id: userToCreate.id.toString(),
      email: "test@example.com",
      name: "Test User",
      authUserId: "",
    };

    await expect(() => sut.execute(request)).rejects.toThrow(
      InvalidCredentialsError
    );
  });

  it("should throw InvalidCredentialsError when authUserId does not match the user id", async () => {
    const userToCreate = makeUser();
    inMemoryUsersRepository.items.push(userToCreate);

    const request = {
      id: userToCreate.id.toString(),
      email: "test@example.com",
      name: "Test User",
      authUserId: "different-user-id",
    };

    await expect(() => sut.execute(request)).rejects.toThrow(
      InvalidCredentialsError
    );
  });

  it("should throw ResourceNotFoundError when user is not found", async () => {
    const request = {
      id: "non-existent-id",
      email: "test@example.com",
      name: "Test User",
      authUserId: "non-existent-id",
    };

    await expect(() => sut.execute(request)).rejects.toThrow(
      ResourceNotFoundError
    );
  });

  it("should throw AttributeConflictError when email is already taken by another user", async () => {
    const userToCreate = makeUser();
    const anotherUserToCreate = makeUser();
    anotherUserToCreate.email = "taken@example.com";

    inMemoryUsersRepository.items.push(userToCreate);
    inMemoryUsersRepository.items.push(anotherUserToCreate);

    const request = {
      id: userToCreate.id.toString(),
      email: anotherUserToCreate.email,
      name: "Test User",
      authUserId: userToCreate.id.toString(),
    };

    await expect(() => sut.execute(request)).rejects.toThrow(
      AttributeConflictError
    );
  });
});

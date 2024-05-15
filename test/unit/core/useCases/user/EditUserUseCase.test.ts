import { describe, it, expect, beforeEach, vi } from "vitest";

import { AttributeConflictError } from "@/core/domain/base/errors/useCases/AttributeConflictError";
import { InvalidCredentialsError } from "@/core/domain/base/errors/useCases/InvalidCredentialsError";
import { ResourceNotFoundError } from "@/core/domain/base/errors/useCases/ResourceNotFoundError";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import {
  EditUserUseCaseRequestDTO,
  EditUserUseCaseResponseDTO,
} from "@/core/useCases/user/dto/EditUserUseCaseDTO";
import { EditUserUseCase } from "@/core/useCases/user/implementations/EditUserUseCase";
import { faker } from "@faker-js/faker";
import { makeUser } from "@test/unit/factories/domain/MakeUser";

let userRepository: IUserRepository;
let sut: EditUserUseCase;

describe("EditUserUseCase", () => {
  beforeEach(() => {
    userRepository = {
      findById: vi.fn(),
      findByEmail: vi.fn(),
      update: vi.fn(),
    } as unknown as IUserRepository;

    sut = new EditUserUseCase(userRepository);
  });

  it("should update the user when the provided data is valid", async () => {
    const userMock = makeUser();

    const updatedUserMock = makeUser({
      ...userMock,
      name: "Updated Name",
      email: "updated@example.com",
    });

    const request: EditUserUseCaseRequestDTO = {
      id: userMock.id.toString(),
      email: updatedUserMock.email,
      name: updatedUserMock.name,
      authUserId: userMock.id.toString(),
    };

    vi.mocked(userRepository.findById).mockResolvedValueOnce(userMock);
    vi.mocked(userRepository.findByEmail).mockResolvedValueOnce(null);
    vi.mocked(userRepository.update).mockResolvedValueOnce(updatedUserMock);

    const response: EditUserUseCaseResponseDTO = {
      user: updatedUserMock,
    };

    const result = await sut.execute(request);

    expect(userRepository.findById).toHaveBeenCalledWith(
      userMock.id.toString()
    );
    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      updatedUserMock.email
    );
    expect(userRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({ id: userMock.id })
    );
    expect(result).toEqual(response);
  });

  it("should throw 'InvalidCredentialsError' when authUserId is not provided", async () => {
    const request: EditUserUseCaseRequestDTO = {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      authUserId: "",
    };

    await expect(() => sut.execute(request)).rejects.toThrow(
      InvalidCredentialsError
    );
  });

  it("should throw 'InvalidCredentialsError' when authUserId does not match the user id", async () => {
    const userMock = makeUser();
    const request: EditUserUseCaseRequestDTO = {
      id: userMock.id.toString(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      authUserId: "different-user-id",
    };

    await expect(() => sut.execute(request)).rejects.toThrow(
      InvalidCredentialsError
    );
  });

  it("should throw 'ResourceNotFoundError' when user is not found", async () => {
    const request: EditUserUseCaseRequestDTO = {
      id: "non-existent-id",
      email: "test@example.com",
      name: "Test User",
      authUserId: "non-existent-id",
    };

    vi.mocked(userRepository.findById).mockResolvedValueOnce(null);

    await expect(() => sut.execute(request)).rejects.toThrow(
      ResourceNotFoundError
    );
  });

  it("should throw 'AttributeConflictError' when email is already taken by another user", async () => {
    const userMock = makeUser();
    const anotherUserMock = makeUser();
    anotherUserMock.email = "taken@example.com";

    const request: EditUserUseCaseRequestDTO = {
      id: userMock.id.toString(),
      email: anotherUserMock.email,
      name: "Test User",
      authUserId: userMock.id.toString(),
    };

    vi.mocked(userRepository.findById).mockResolvedValueOnce(userMock);
    vi.mocked(userRepository.findByEmail).mockResolvedValueOnce(
      anotherUserMock
    );

    await expect(() => sut.execute(request)).rejects.toThrow(
      AttributeConflictError
    );
  });
});

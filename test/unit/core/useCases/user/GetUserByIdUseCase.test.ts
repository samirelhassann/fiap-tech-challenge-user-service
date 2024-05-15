import { describe, it, expect, beforeEach, vi } from "vitest";

import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import {
  GetUserByIdUseCaseRequestDTO,
  GetUserByIdUseCaseResponseDTO,
} from "@/core/useCases/user/dto/GetUserByIdUseCaseDTO";
import { IUserUseCase } from "@/core/useCases/user/IUserUseCase";
import { UserUseCase } from "@/core/useCases/user/UserUseCase";
import { makeUser } from "@test/unit/factories/domain/MakeUser";

let userRepository: IUserRepository;
let sut: IUserUseCase;

describe("GetUserByIdUseCase", () => {
  beforeEach(() => {
    userRepository = {
      findById: vi.fn(),
    } as unknown as IUserRepository;

    sut = new UserUseCase(userRepository);
  });

  it("should return paginated users", async () => {
    const userMock = makeUser();

    const request: GetUserByIdUseCaseRequestDTO = {
      id: userMock.id.toString(),
    };

    const respositoryResponseMock = userMock;

    const response: GetUserByIdUseCaseResponseDTO = {
      user: userMock,
    };

    vi.mocked(userRepository.findById).mockResolvedValueOnce(
      respositoryResponseMock
    );

    const result = await sut.getUserById(request);

    expect(userRepository.findById).toHaveBeenCalledWith(
      userMock.id.toString()
    );
    expect(result).toEqual(response);
  });

  it("should throw an error when the informed id does not exist", async () => {
    const userMock = makeUser();

    const request: GetUserByIdUseCaseRequestDTO = {
      id: userMock.id.toString(),
    };

    vi.mocked(userRepository.findById).mockResolvedValueOnce(null);

    await expect(() => sut.getUserById(request)).rejects.toThrowError();
  });
});

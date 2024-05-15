import { describe, it, expect, beforeEach, vi } from "vitest";

import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { PaginationResponse } from "@/core/domain/base/PaginationResponse";
import { User } from "@/core/domain/entities/User";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import { GetUsersUseCaseRequestDTO } from "@/core/useCases/user/dto/GetUsersUseCaseDTO";
import { IUserUseCase } from "@/core/useCases/user/IUserUseCase";
import { UserUseCase } from "@/core/useCases/user/UserUseCase";
import { makeUser } from "@test/unit/factories/domain/MakeUser";

let userRepository: IUserRepository;
let sut: IUserUseCase;

describe("GetUsersUseCase", () => {
  beforeEach(() => {
    userRepository = {
      findMany: vi.fn(),
    } as unknown as IUserRepository;

    sut = new UserUseCase(userRepository);
  });

  it("should return paginated users", async () => {
    const dataMock = [makeUser(), makeUser()];
    const paginationResponse = new PaginationResponse<User>({
      data: dataMock,
      currentPage: 1,
      pageSize: 10,
      totalItems: dataMock.length,
      totalPages: 1,
    });

    vi.mocked(userRepository.findMany).mockResolvedValueOnce(
      paginationResponse
    );

    const params = new PaginationParams(1, 10);
    const requestDTO: GetUsersUseCaseRequestDTO = { params };

    const result = await sut.getUsers(requestDTO);

    expect(userRepository.findMany).toHaveBeenCalledWith(params);
    expect(result).toEqual({ paginationResponse });
  });
});

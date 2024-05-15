import { describe, it, expect, beforeEach, vi } from "vitest";

import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import {
  CheckUserByTaxvatUseCaseRequestDTO,
  CheckUserByTaxvatUseCaseResponseDTO,
} from "@/core/useCases/user/dto/CheckUserByTaxvatUseCaseDTO";
import { IUserUseCase } from "@/core/useCases/user/IUserUseCase";
import { UserUseCase } from "@/core/useCases/user/UserUseCase";
import { makeUser } from "@test/unit/factories/domain/MakeUser";

let userRepository: IUserRepository;
let sut: IUserUseCase;

describe("CheckByTaxvatUseCase", () => {
  beforeEach(() => {
    userRepository = {
      findByTaxVat: vi.fn(),
    } as unknown as IUserRepository;

    sut = new UserUseCase(userRepository);
  });

  it("should check the taxvat correctly", async () => {
    const userMock = makeUser();

    const request: CheckUserByTaxvatUseCaseRequestDTO = {
      taxvat: userMock.taxVat.number,
    };
    const respositoryResponseMock = userMock;

    const response: CheckUserByTaxvatUseCaseResponseDTO = {
      exist: true,
    };

    vi.mocked(userRepository.findByTaxVat).mockResolvedValueOnce(
      respositoryResponseMock
    );

    const result = await sut.checkByTaxvat(request);

    expect(userRepository.findByTaxVat).toHaveBeenCalledWith(
      userMock.taxVat.number
    );
    expect(result).toEqual(response);
  });

  it("should return exists false when the user does not exist", async () => {
    const userMock = makeUser();

    const request: CheckUserByTaxvatUseCaseRequestDTO = {
      taxvat: userMock.taxVat.number,
    };

    vi.mocked(userRepository.findByTaxVat).mockResolvedValueOnce(null);
    const result = await sut.checkByTaxvat(request);

    expect(userRepository.findByTaxVat).toHaveBeenCalledWith(
      userMock.taxVat.number
    );

    expect(result.exist).toBe(false);
  });
});

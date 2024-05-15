import { describe, it, expect, beforeEach, vi } from "vitest";

import { AttributeConflictError } from "@/core/domain/base/errors/useCases/AttributeConflictError";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";
import { AuthUseCase } from "@/core/useCases/auth/AuthUseCase";
import {
  RegisterUseCaseRequestDTO,
  RegisterUseCaseResponseDTO,
} from "@/core/useCases/auth/dto/RegisterUseCaseDTO";
import { IAuthUseCase } from "@/core/useCases/auth/IAuthUseCase";
import { makeUser } from "@test/unit/factories/domain/MakeUser";

let userRepository: IUserRepository;
let sut: IAuthUseCase;

describe("RegisterUseCase", () => {
  beforeEach(() => {
    userRepository = {
      findByTaxVat: vi.fn(),
      findByEmail: vi.fn(),
      create: vi.fn(),
    } as unknown as IUserRepository;

    sut = new AuthUseCase(userRepository);
  });

  it("should register a new user when the provided data is valid", async () => {
    const userMock = makeUser();

    const request: RegisterUseCaseRequestDTO = {
      taxVat: userMock.taxVat.number,
      name: userMock.name,
      email: userMock.email,
      password: "validPassword123",
      role: userMock.role.name,
    };

    vi.mocked(userRepository.findByTaxVat).mockResolvedValueOnce(null);
    vi.mocked(userRepository.findByEmail).mockResolvedValueOnce(null);

    const response: RegisterUseCaseResponseDTO = {};

    const result = await sut.register(request);

    expect(userRepository.findByTaxVat).toHaveBeenCalledWith(
      userMock.taxVat.number
    );
    expect(userRepository.findByEmail).toHaveBeenCalledWith(userMock.email);
    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: userMock.email,
        name: userMock.name,
      })
    );
    expect(result).toEqual(response);
  });

  it("should throw AttributeConflictError when taxVat is already taken", async () => {
    const userMock = makeUser();

    const request: RegisterUseCaseRequestDTO = {
      taxVat: userMock.taxVat.number,
      name: userMock.name,
      email: userMock.email,
      password: "validPassword123",
      role: userMock.role.name,
    };

    vi.mocked(userRepository.findByTaxVat).mockResolvedValueOnce(userMock);

    await expect(() => sut.register(request)).rejects.toThrow(
      AttributeConflictError
    );
  });

  it("should throw AttributeConflictError when email is already taken", async () => {
    const userMock = makeUser();

    const request: RegisterUseCaseRequestDTO = {
      taxVat: userMock.taxVat.number,
      name: userMock.name,
      email: userMock.email,
      password: "validPassword123",
      role: userMock.role.name,
    };

    vi.mocked(userRepository.findByTaxVat).mockResolvedValueOnce(null);
    vi.mocked(userRepository.findByEmail).mockResolvedValueOnce(userMock);

    await expect(() => sut.register(request)).rejects.toThrow(
      AttributeConflictError
    );
  });
});

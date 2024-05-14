/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";

import {
  AuthenticateUseCaseRequestDTO,
  AuthenticateUseCaseResponseDTO,
} from "./dto/AuthenticateUseCaseDTO";
import {
  RegisterUseCaseRequestDTO,
  RegisterUseCaseResponseDTO,
} from "./dto/RegisterUseCaseDTO";
import { IAuthUseCase } from "./IAuthUseCase";
import { AuthenticateUseCase } from "./implementations/AuthenticateUseCase";
import { RegisterUseCase } from "./implementations/RegisterUseCase";

export class AuthUseCase implements IAuthUseCase {
  private registerUseCase: RegisterUseCase;

  private authenticateUseCase: AuthenticateUseCase;

  constructor(private userRepository: IUserRepository) {
    this.registerUseCase = new RegisterUseCase(userRepository);
    this.authenticateUseCase = new AuthenticateUseCase(userRepository);
  }

  async register(
    props: RegisterUseCaseRequestDTO
  ): Promise<RegisterUseCaseResponseDTO> {
    return this.registerUseCase.execute(props);
  }

  async authenticate(
    props: AuthenticateUseCaseRequestDTO
  ): Promise<AuthenticateUseCaseResponseDTO> {
    return this.authenticateUseCase.execute(props);
  }
}

import { InvalidCredentialsError } from "@/core/domain/base/errors/useCases/InvalidCredentialsError";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";

import {
  AuthenticateUseCaseRequestDTO,
  AuthenticateUseCaseResponseDTO,
} from "../dto/AuthenticateUseCaseDTO";

export class AuthenticateUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequestDTO): Promise<AuthenticateUseCaseResponseDTO> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = user.passwordHash.comparePassword(password);

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    return {
      role: user.role.name,
      userId: user.id.toValue(),
    };
  }
}

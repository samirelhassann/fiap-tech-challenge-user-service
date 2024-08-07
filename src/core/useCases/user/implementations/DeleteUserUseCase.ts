import { InvalidCredentialsError } from "@/core/domain/base/errors/useCases/InvalidCredentialsError";
import { ResourceNotFoundError } from "@/core/domain/base/errors/useCases/ResourceNotFoundError";
import { User } from "@/core/domain/entities/User";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";

import { DeleteUserUseCaseRequestDTO } from "../dto/DeleteUserUseCaseDTO";

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    id,
    authUserId,
  }: DeleteUserUseCaseRequestDTO): Promise<void> {
    if (!authUserId) {
      throw new InvalidCredentialsError();
    }

    const isTheUserHimself = id === authUserId;

    if (!isTheUserHimself) {
      throw new InvalidCredentialsError();
    }

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new ResourceNotFoundError(User.name);
    }

    await this.userRepository.delete(id);
  }
}

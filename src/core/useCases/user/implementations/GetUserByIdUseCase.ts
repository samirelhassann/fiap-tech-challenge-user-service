import { ResourceNotFoundError } from "@/core/domain/base/errors/useCases/ResourceNotFoundError";
import { User } from "@/core/domain/entities/User";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";

import {
  GetUserByIdUseCaseRequestDTO,
  GetUserByIdUseCaseResponseDTO,
} from "../dto/GetUserByIdUseCaseDTO";

export class GetUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    id,
  }: GetUserByIdUseCaseRequestDTO): Promise<GetUserByIdUseCaseResponseDTO> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new ResourceNotFoundError(User.name);
    }

    return { user };
  }
}

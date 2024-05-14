import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";

import {
  GetUsersUseCaseRequestDTO,
  GetUsersUseCaseResponseDTO,
} from "../dto/GetUsersUseCaseDTO";

export class GetUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    params,
  }: GetUsersUseCaseRequestDTO): Promise<GetUsersUseCaseResponseDTO> {
    const paginationResponse = await this.userRepository.findMany(params);

    return { paginationResponse };
  }
}

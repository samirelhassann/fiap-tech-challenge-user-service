import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";

import {
  CheckUserByTaxvatUseCaseRequestDTO,
  CheckUserByTaxvatUseCaseResponseDTO,
} from "../dto/CheckUserByTaxvatUseCaseDTO";

export class CheckByTaxvatUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    taxvat,
  }: CheckUserByTaxvatUseCaseRequestDTO): Promise<CheckUserByTaxvatUseCaseResponseDTO> {
    const user = await this.userRepository.findByTaxVat(taxvat);

    if (!user) {
      return { exist: false };
    }

    return { exist: true };
  }
}

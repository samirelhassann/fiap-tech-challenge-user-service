import { AttributeConflictError } from "@/core/domain/base/errors/useCases/AttributeConflictError";
import { User } from "@/core/domain/entities/User";
import { Password } from "@/core/domain/valueObjects/Password";
import { Role } from "@/core/domain/valueObjects/Role";
import { Taxvat } from "@/core/domain/valueObjects/Taxvat";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";

import {
  RegisterUseCaseRequestDTO,
  RegisterUseCaseResponseDTO,
} from "../dto/RegisterUseCaseDTO";

export class RegisterUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    taxVat,
    name,
    email,
    password,
    role,
  }: RegisterUseCaseRequestDTO): Promise<RegisterUseCaseResponseDTO> {
    const hasUserWithSameTaxVat =
      await this.userRepository.findByTaxVat(taxVat);

    if (hasUserWithSameTaxVat) {
      throw new AttributeConflictError<User>("taxVat", User.name);
    }

    const hasUserWithSameEmail = await this.userRepository.findByEmail(email);

    if (hasUserWithSameEmail) {
      throw new AttributeConflictError<User>("email", User.name);
    }

    const userToCreate = new User({
      email,
      name,
      taxVat: new Taxvat({ number: taxVat }),
      passwordHash: new Password({ value: Password.valueToHash(password) }),
      role: new Role({ name: role }),
    });

    await this.userRepository.create(userToCreate);

    return {};
  }
}

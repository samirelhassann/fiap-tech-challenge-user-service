/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import { AttributeConflictError } from "@/core/domain/base/errors/useCases/AttributeConflictError";
import { InvalidCredentialsError } from "@/core/domain/base/errors/useCases/InvalidCredentialsError";
import { User } from "@/core/domain/entities/User";
import { Password } from "@/core/domain/valueObjects/Password";
import { Role } from "@/core/domain/valueObjects/Role";
import { Taxvat } from "@/core/domain/valueObjects/Taxvat";
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

export class AuthUseCase implements IAuthUseCase {
  constructor(private userRepository: IUserRepository) {}

  async register({
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

  async authenticate({
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

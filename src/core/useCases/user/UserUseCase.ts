import { AttributeConflictError } from "@/core/domain/base/errors/useCases/AttributeConflictError";
import { InvalidCredentialsError } from "@/core/domain/base/errors/useCases/InvalidCredentialsError";
import { ResourceNotFoundError } from "@/core/domain/base/errors/useCases/ResourceNotFoundError";
import { User } from "@/core/domain/entities/User";
import { IUserRepository } from "@/core/interfaces/repositories/IUserRepository";

import {
  CheckUserByTaxvatUseCaseRequestDTO,
  CheckUserByTaxvatUseCaseResponseDTO,
} from "./dto/CheckUserByTaxvatUseCaseDTO";
import {
  EditUserUseCaseRequestDTO,
  EditUserUseCaseResponseDTO,
} from "./dto/EditUserUseCaseDTO";
import {
  GetUserByIdUseCaseRequestDTO,
  GetUserByIdUseCaseResponseDTO,
} from "./dto/GetUserByIdUseCaseDTO";
import {
  GetUsersUseCaseRequestDTO,
  GetUsersUseCaseResponseDTO,
} from "./dto/GetUsersUseCaseDTO";
import { IUserUseCase } from "./IUserUseCase";

export class UserUseCase implements IUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async getUsers({
    params,
  }: GetUsersUseCaseRequestDTO): Promise<GetUsersUseCaseResponseDTO> {
    const paginationResponse = await this.userRepository.findMany(params);

    return { paginationResponse };
  }

  async checkByTaxvat({
    taxvat,
  }: CheckUserByTaxvatUseCaseRequestDTO): Promise<CheckUserByTaxvatUseCaseResponseDTO> {
    const user = await this.userRepository.findByTaxVat(taxvat);

    if (!user) {
      return { exist: false };
    }

    return { exist: true };
  }

  async getUserById({
    id,
  }: GetUserByIdUseCaseRequestDTO): Promise<GetUserByIdUseCaseResponseDTO> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new ResourceNotFoundError(User.name);
    }

    return { user };
  }

  async editUser({
    id,
    email,
    name,
    authUserId,
  }: EditUserUseCaseRequestDTO): Promise<EditUserUseCaseResponseDTO> {
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

    if (email) {
      const hasUserWithSameEmail = await this.userRepository.findByEmail(email);

      if (hasUserWithSameEmail && hasUserWithSameEmail.id !== user.id) {
        throw new AttributeConflictError<User>("email", User.name);
      }
      user.email = email;
    }

    if (name) {
      user.name = name;
    }

    const updatedUser = await this.userRepository.update(user);

    return { user: updatedUser };
  }
}

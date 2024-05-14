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

export interface IUserUseCase {
  getUsers(
    props: GetUsersUseCaseRequestDTO
  ): Promise<GetUsersUseCaseResponseDTO>;

  checkByTaxvat(
    props: CheckUserByTaxvatUseCaseRequestDTO
  ): Promise<CheckUserByTaxvatUseCaseResponseDTO>;

  getUserById(
    props: GetUserByIdUseCaseRequestDTO
  ): Promise<GetUserByIdUseCaseResponseDTO>;

  editUser(
    props: EditUserUseCaseRequestDTO
  ): Promise<EditUserUseCaseResponseDTO>;
}

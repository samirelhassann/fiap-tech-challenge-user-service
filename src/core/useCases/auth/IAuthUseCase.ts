import {
  AuthenticateUseCaseRequestDTO,
  AuthenticateUseCaseResponseDTO,
} from "./dto/AuthenticateUseCaseDTO";
import {
  RegisterUseCaseRequestDTO,
  RegisterUseCaseResponseDTO,
} from "./dto/RegisterUseCaseDTO";

export interface IAuthUseCase {
  register(
    props: RegisterUseCaseRequestDTO
  ): Promise<RegisterUseCaseResponseDTO>;

  authenticate(
    props: AuthenticateUseCaseRequestDTO
  ): Promise<AuthenticateUseCaseResponseDTO>;
}

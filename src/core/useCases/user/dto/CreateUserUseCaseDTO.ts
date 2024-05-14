import { User } from "@/core/domain/entities/User";

export interface CreateUserUseCaseRequestDTO {
  name: string;
  email: string;
  taxVat: string;
}

export interface CreateUserUseCaseResponseDTO {
  user: User;
}

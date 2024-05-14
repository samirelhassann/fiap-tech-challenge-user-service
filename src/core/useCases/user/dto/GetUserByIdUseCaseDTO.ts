import { User } from "@/core/domain/entities/User";

export interface GetUserByIdUseCaseRequestDTO {
  id: string;
}

export interface GetUserByIdUseCaseResponseDTO {
  user: User;
}

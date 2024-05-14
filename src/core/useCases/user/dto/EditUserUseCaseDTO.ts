import { User } from "@/core/domain/entities/User";

export interface EditUserUseCaseRequestDTO {
  id: string;
  authUserId?: string;
  name?: string;
  email?: string;
}

export interface EditUserUseCaseResponseDTO {
  user: User;
}

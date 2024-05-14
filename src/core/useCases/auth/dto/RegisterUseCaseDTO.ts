import { RoleEnum } from "@/core/domain/enums/RoleEnum";

export interface RegisterUseCaseRequestDTO {
  name: string;
  email: string;
  taxVat: string;
  password: string;
  role: RoleEnum;
}

export interface RegisterUseCaseResponseDTO {}

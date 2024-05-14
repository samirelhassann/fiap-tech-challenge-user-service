import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { PaginationResponse } from "@/core/domain/base/PaginationResponse";
import { User } from "@/core/domain/entities/User";

export interface GetUsersUseCaseRequestDTO {
  params: PaginationParams;
}

export interface GetUsersUseCaseResponseDTO {
  paginationResponse: PaginationResponse<User>;
}

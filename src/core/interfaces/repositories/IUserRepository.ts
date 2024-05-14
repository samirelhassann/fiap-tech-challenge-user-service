import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { PaginationResponse } from "@/core/domain/base/PaginationResponse";
import { User } from "@/core/domain/entities/User";

export interface IUserRepository {
  findMany(params: PaginationParams): Promise<PaginationResponse<User>>;

  findById(id: string): Promise<User | null>;

  findByTaxVat(taxVat: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  create(user: User): Promise<User>;

  update(user: User): Promise<User>;
}

import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { PaginationResponse } from "@/core/domain/base/PaginationResponse";
import { Combo } from "@/core/domain/entities/Combo";

export interface IComboRepository {
  findMany(params: PaginationParams): Promise<PaginationResponse<Combo>>;

  findManyByIds(ids: string[]): Promise<Combo[]>;

  findById(id: string): Promise<Combo | null>;

  create(combo: Combo): Promise<Combo>;

  update(combo: Combo): Promise<Combo>;

  delete(id: string): Promise<void>;
}

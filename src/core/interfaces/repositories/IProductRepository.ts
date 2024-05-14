import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { PaginationResponse } from "@/core/domain/base/PaginationResponse";
import { Product } from "@/core/domain/entities/Product";
import { Category } from "@/core/domain/valueObjects/Category";

export interface IProductRepository {
  findMany(
    params: PaginationParams,
    includeInactive: boolean,
    category?: Category
  ): Promise<PaginationResponse<Product>>;

  findById(id: string): Promise<Product | null>;

  findByIdAndCategory(id: string, category: Category): Promise<Product | null>;

  findManyByIds(ids: string[]): Promise<Product[]>;

  findByName(email: string): Promise<Product | null>;

  create(product: Product): Promise<Product>;

  update(product: Product): Promise<Product>;
}

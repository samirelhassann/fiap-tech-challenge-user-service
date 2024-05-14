import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { ComboProduct } from "@/core/domain/entities/ComboProduct";

export interface IComboProductRepository {
  findById(id: string): Promise<ComboProduct | null>;

  findMany(params: PaginationParams): Promise<ComboProduct[]>;

  findManyByComboID(comboId: string): Promise<ComboProduct[]>;

  findByProductIdAndComboId(
    productId: string,
    comboId: string
  ): Promise<ComboProduct | null>;

  create(comboProduct: ComboProduct): Promise<ComboProduct>;

  createMany(comboProducts: ComboProduct[]): Promise<number>;

  deleteMany(comboProducts: ComboProduct[]): Promise<number>;

  deleteByComboId(id: string): Promise<void>;
}

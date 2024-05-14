import { OrderComboItem } from "@/core/domain/entities/OrderComboItem";

export interface IOrderComboItemRepository {
  findById(id: string): Promise<OrderComboItem | null>;

  findManyByOrderId(orderId: string): Promise<OrderComboItem[]>;

  create(orderComboItem: OrderComboItem): Promise<OrderComboItem>;

  createMany(orderComboItems: OrderComboItem[]): Promise<number>;

  deleteByComboId(id: string): Promise<void>;
}

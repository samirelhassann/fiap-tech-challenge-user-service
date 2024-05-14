import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { PaginationResponse } from "@/core/domain/base/PaginationResponse";
import { Order } from "@/core/domain/entities/Order";
import { OrderStatus } from "@/core/domain/valueObjects/OrderStatus";

export interface IOrderRepository {
  findMany(
    params: PaginationParams,
    status?: OrderStatus,
    userId?: string
  ): Promise<PaginationResponse<Order>>;

  findManyByStatuses(statuses: OrderStatus[]): Promise<Order[]>;

  findManyByUserId(
    params: PaginationParams,
    userId: string
  ): Promise<PaginationResponse<Order>>;

  findById(id: string): Promise<Order | null>;

  create(order: Order): Promise<Order>;

  update(order: Order): Promise<Order>;
}

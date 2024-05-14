import { PaginationParams } from "@/core/domain/base/PaginationParams";
import { PaginationResponse } from "@/core/domain/base/PaginationResponse";
import { OrderNotification } from "@/core/domain/entities/OrderNotification";

export interface IOrderNotificationRepository {
  findMany(
    params: PaginationParams
  ): Promise<PaginationResponse<OrderNotification>>;
  findById(id: string): Promise<OrderNotification | null>;
  create(orderNotification: OrderNotification): Promise<OrderNotification>;
  update(orderNotification: OrderNotification): Promise<OrderNotification>;
}

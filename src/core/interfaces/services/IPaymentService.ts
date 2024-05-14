import { Order } from "@/core/domain/entities/Order";

export interface IPaymentService {
  createPayment(order: Order): Promise<{
    qrCode: string;
  }>;

  getOrderStatus(platformOrderId: string): Promise<{
    status: string;
    orderId: string;
  }>;
}

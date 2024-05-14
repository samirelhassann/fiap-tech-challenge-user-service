import { UniqueEntityId } from "../entities/UniqueEntityId";

export interface DomainEvent {
  ocurredAt: Date;
  getAggregateId(): UniqueEntityId;
}

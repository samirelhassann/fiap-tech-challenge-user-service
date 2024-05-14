/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable lines-between-class-members */
/* eslint-disable max-classes-per-file */

import { describe, expect, it, vi } from "vitest";

import { AggregateRoot } from "@/core/domain/base/entities/AggregateRoot";
import { UniqueEntityId } from "@/core/domain/base/entities/UniqueEntityId";
import { DomainEvent } from "@/core/domain/base/events/DomainEvent";
import { DomainEvents } from "@/core/domain/base/events/DomainEvents";

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date;

  private aggregate: CustomAggregate;

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date();
    this.aggregate = aggregate;
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id;
  }
}

class CustomAggregate extends AggregateRoot<any> {
  static create() {
    const aggregate = new CustomAggregate(null);

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));

    return aggregate;
  }
}

describe("DomainEvents", () => {
  it("should be able to dispatch and listen to events", () => {
    const callbackSpy = vi.fn();

    DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

    const aggregate = CustomAggregate.create();

    expect(aggregate.domainEvents).toHaveLength(1);

    DomainEvents.dispatchEventsForAggregate(aggregate.id);
    expect(callbackSpy).toHaveBeenCalled();
    expect(aggregate.domainEvents).toHaveLength(0);
  });
});

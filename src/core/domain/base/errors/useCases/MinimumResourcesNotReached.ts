import { UseCaseError } from "./UseCaseError";

export class MinimumResourcesNotReached extends Error implements UseCaseError {
  details?: string[];

  constructor(entity: string, details?: string[]) {
    super(`Minimum ${entity} not reached`);
    this.details = details;
  }
}

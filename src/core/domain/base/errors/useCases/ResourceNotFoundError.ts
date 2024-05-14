import { UseCaseError } from "./UseCaseError";

export class ResourceNotFoundError extends Error implements UseCaseError {
  entity: string;

  details?: string[];

  constructor(entity?: string, details?: string[]) {
    super(`${entity || "Resource"} not found.`);
    this.entity = entity || "Resource";
    this.details = details;
  }
}

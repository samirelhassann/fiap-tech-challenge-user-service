import { EntityError } from "./EntityError";

export class EntityPropValidationError<T> extends Error implements EntityError {
  propName: string;

  validationError: string;

  constructor(attribute: keyof T, validationErrors: string) {
    super(`Attribute ${attribute.toString()} is invalid`);
    this.propName = attribute.toString();
    this.validationError = validationErrors;
  }
}

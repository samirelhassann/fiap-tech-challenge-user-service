import { ValueObjectError } from "./ValueObjectError";

export class ValueObjectValidationError
  extends Error
  implements ValueObjectError
{
  details?: string[];

  constructor(valueObject: string, details?: string[]) {
    super(`${valueObject} is invalid.`);

    this.details = details;
  }
}

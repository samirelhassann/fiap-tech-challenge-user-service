import { EntityError } from "./EntityError";

export class EmptyArgumentError extends Error implements EntityError {
  constructor(argument: string) {
    super(`Argument ${argument} is empty`);
  }
}

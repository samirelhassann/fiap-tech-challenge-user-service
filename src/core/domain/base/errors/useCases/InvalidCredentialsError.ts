import { UseCaseError } from "./UseCaseError";

export class InvalidCredentialsError extends Error implements UseCaseError {
  constructor() {
    super("Invalid credentials");
  }
}

import { FastifyReply } from "fastify";
import { describe, expect, it, beforeEach, vi } from "vitest";

import { ErrorHandlingPresenter } from "@/adapters/presenters/base/ErrorHandlingPresenter";
import { EntityPropValidationError } from "@/core/domain/base/errors/entities/EntityPropValidationError";
import { AttributeConflictError } from "@/core/domain/base/errors/useCases/AttributeConflictError";
import { ResourceNotFoundError } from "@/core/domain/base/errors/useCases/ResourceNotFoundError";
import { ValueObjectValidationError } from "@/core/domain/base/errors/valueObjects/ValueObjectValidationError";

class TestErrorHandlingPresenter extends ErrorHandlingPresenter {}

let presenter: TestErrorHandlingPresenter;
let res: FastifyReply;

beforeEach(() => {
  presenter = new TestErrorHandlingPresenter();

  res = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  } as unknown as FastifyReply;
});

describe("ErrorHandlingPresenter", () => {
  it("should handle ResourceNotFoundError", () => {
    const error = new ResourceNotFoundError("User", ["User not found"]);

    presenter.convertErrorResponse(error, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      message: "User not found.",
      details: ["User not found"],
    });
  });

  it("should handle AttributeConflictError", () => {
    const error = new AttributeConflictError("email", "Email already exists");

    presenter.convertErrorResponse(error, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: "please inform another email.",
    });
  });

  it("should handle EntityPropValidationError", () => {
    const error = new EntityPropValidationError("name", "Invalid name");

    presenter.convertErrorResponse(error, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: "validation error",
      details: [
        {
          attribute: "name",
          message: "Invalid name",
        },
      ],
    });
  });

  it("should handle ValueObjectValidationError", () => {
    const error = new ValueObjectValidationError("Invalid value", [
      "Invalid format",
    ]);

    presenter.convertErrorResponse(error, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: "Invalid value is invalid.",
      details: ["Invalid format"],
    });
  });

  it("should rethrow unhandled errors", () => {
    const error = new Error("Unhandled error");

    expect(() => presenter.convertErrorResponse(error, res)).toThrow(error);
  });
});

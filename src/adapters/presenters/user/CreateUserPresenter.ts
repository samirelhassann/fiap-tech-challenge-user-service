/* eslint-disable @typescript-eslint/no-unused-vars */

import { FastifyReply, FastifyRequest } from "fastify";

import { createUserPayloadSchema } from "@/adapters/controllers/user/schemas/CreateUserSchema";
import {
  CreateUserUseCaseRequestDTO,
  CreateUserUseCaseResponseDTO,
} from "@/core/useCases/user/dto/CreateUserUseCaseDTO";

import { ErrorHandlingPresenter } from "../base/ErrorHandlingPresenter";
import { IControllerPresenter } from "../base/IControllerPresenter";

export class CreateUserPresenter
  extends ErrorHandlingPresenter
  implements
    IControllerPresenter<
      CreateUserUseCaseRequestDTO,
      CreateUserUseCaseResponseDTO
    >
{
  convertToUseCaseDTO(req: FastifyRequest): CreateUserUseCaseRequestDTO {
    const { email, name, taxVat } = createUserPayloadSchema.parse(req.body);

    return {
      email,
      name,
      taxVat,
    };
  }

  async sendResponse(
    res: FastifyReply,
    _useCaseResponseModel: CreateUserUseCaseResponseDTO
  ) {
    return res.status(201).send();
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */

import { FastifyReply, FastifyRequest } from "fastify";

import { registerPayloadSchema } from "@/adapters/controllers/auth/schemas/RegisterSchema";
import {
  RegisterUseCaseRequestDTO,
  RegisterUseCaseResponseDTO,
} from "@/core/useCases/auth/dto/RegisterUseCaseDTO";

import { ErrorHandlingPresenter } from "../base/ErrorHandlingPresenter";
import { IControllerPresenter } from "../base/IControllerPresenter";

export class RegisterPresenter
  extends ErrorHandlingPresenter
  implements
    IControllerPresenter<RegisterUseCaseRequestDTO, RegisterUseCaseResponseDTO>
{
  convertToUseCaseDTO(req: FastifyRequest): RegisterUseCaseRequestDTO {
    return registerPayloadSchema.parse(req.body);
  }

  async sendResponse(
    res: FastifyReply,
    _useCaseResponseModel: RegisterUseCaseResponseDTO
  ) {
    return res.status(201).send();
  }
}

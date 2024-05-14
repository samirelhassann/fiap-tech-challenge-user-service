/* eslint-disable @typescript-eslint/no-unused-vars */

import { FastifyReply, FastifyRequest } from "fastify";

import { authenticatePayloadSchema } from "@/adapters/controllers/auth/schemas/AuthenticateSchema";
import {
  AuthenticateUseCaseRequestDTO,
  AuthenticateUseCaseResponseDTO,
} from "@/core/useCases/auth/dto/AuthenticateUseCaseDTO";

import { ErrorHandlingPresenter } from "../base/ErrorHandlingPresenter";
import { IControllerPresenter } from "../base/IControllerPresenter";

export class AuthenticatePresenter
  extends ErrorHandlingPresenter
  implements
    IControllerPresenter<
      AuthenticateUseCaseRequestDTO,
      AuthenticateUseCaseResponseDTO
    >
{
  convertToUseCaseDTO(req: FastifyRequest): AuthenticateUseCaseRequestDTO {
    return authenticatePayloadSchema.parse(req.body);
  }

  async sendResponse(
    res: FastifyReply,
    useCaseResponseModel: AuthenticateUseCaseResponseDTO
  ): Promise<FastifyReply> {
    const token = await res.jwtSign(
      {
        role: useCaseResponseModel.role,
      },
      {
        sign: {
          sub: useCaseResponseModel.userId,
        },
      }
    );

    const refreshToken = await res.jwtSign(
      {
        role: useCaseResponseModel.role,
      },
      {
        sign: {
          sub: useCaseResponseModel.userId,
          expiresIn: "1d",
        },
      }
    );

    return res
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({
        token,
      });
  }
}

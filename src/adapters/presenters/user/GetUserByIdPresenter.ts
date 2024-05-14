import { FastifyReply, FastifyRequest } from "fastify";

import { getUserByIdQueryParamsSchema } from "@/adapters/controllers/user/schemas/GetUserByIdSchema";
import { GetUserByIdViewModel } from "@/adapters/controllers/user/viewModels/GetUserByIdViewModel";
import {
  GetUserByIdUseCaseRequestDTO,
  GetUserByIdUseCaseResponseDTO,
} from "@/core/useCases/user/dto/GetUserByIdUseCaseDTO";

import { ErrorHandlingPresenter } from "../base/ErrorHandlingPresenter";
import { IControllerPresenter } from "../base/IControllerPresenter";

export class GetUserByIdPresenter
  extends ErrorHandlingPresenter
  implements
    IControllerPresenter<
      GetUserByIdUseCaseRequestDTO,
      GetUserByIdUseCaseResponseDTO,
      GetUserByIdViewModel
    >
{
  convertToUseCaseDTO(req: FastifyRequest): GetUserByIdUseCaseRequestDTO {
    const { id } = getUserByIdQueryParamsSchema.parse(req.params);

    return {
      id,
    };
  }

  convertToViewModel(
    model: GetUserByIdUseCaseResponseDTO
  ): GetUserByIdViewModel {
    const user = {
      id: model.user.id.toString(),
      name: model.user.name,
      email: model.user.email,
      taxVat: model.user.taxVat.number,
      createdAt: model.user.createdAt.toISOString(),
      updatedAt: model.user.updatedAt?.toISOString(),
    };

    return user;
  }

  async sendResponse(
    res: FastifyReply,
    useCaseResponseModel: GetUserByIdUseCaseResponseDTO
  ) {
    const user = this.convertToViewModel(useCaseResponseModel);

    return res.status(200).send(user);
  }
}

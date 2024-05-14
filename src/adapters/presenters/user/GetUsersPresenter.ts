import { FastifyReply, FastifyRequest } from "fastify";

import { getUsersQueryParamsSchema } from "@/adapters/controllers/user/schemas/GetUsersSchema";
import { GetUsersViewModel } from "@/adapters/controllers/user/viewModels/GetUsersViewModel";
import { PaginationParams } from "@/core/domain/base/PaginationParams";
import {
  GetUsersUseCaseRequestDTO,
  GetUsersUseCaseResponseDTO,
} from "@/core/useCases/user/dto/GetUsersUseCaseDTO";

import { ErrorHandlingPresenter } from "../base/ErrorHandlingPresenter";
import { IControllerPresenter } from "../base/IControllerPresenter";

export class GetUsersPresenter
  extends ErrorHandlingPresenter
  implements
    IControllerPresenter<
      GetUsersUseCaseRequestDTO,
      GetUsersUseCaseResponseDTO,
      GetUsersViewModel
    >
{
  convertToUseCaseDTO(req: FastifyRequest): GetUsersUseCaseRequestDTO {
    const { page, pageSize } = getUsersQueryParamsSchema.parse(req.query);

    const params = new PaginationParams(page, pageSize);

    return {
      params,
    };
  }

  convertToViewModel(model: GetUsersUseCaseResponseDTO): GetUsersViewModel {
    const users = model.paginationResponse.toResponse((item) => ({
      id: item.id.toString(),
      name: item.name,
      email: item.email,
      taxVat: item.taxVat.number,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt?.toISOString(),
    }));

    return users;
  }

  async sendResponse(res: FastifyReply, response: GetUsersUseCaseResponseDTO) {
    const users = this.convertToViewModel(response);

    return res.status(200).send(users);
  }
}

import { FastifyReply, FastifyRequest } from "fastify";

import {
  editUserPathParametersSchema,
  editUserPayloadSchema,
} from "@/adapters/controllers/user/schemas/EditUserSchema";
import { EditUserViewModel } from "@/adapters/controllers/user/viewModels/EditUserViewModel";
import {
  EditUserUseCaseRequestDTO,
  EditUserUseCaseResponseDTO,
} from "@/core/useCases/user/dto/EditUserUseCaseDTO";

import { ErrorHandlingPresenter } from "../base/ErrorHandlingPresenter";
import { IControllerPresenter } from "../base/IControllerPresenter";

export class EditUserPresenter
  extends ErrorHandlingPresenter
  implements
    IControllerPresenter<
      EditUserUseCaseRequestDTO,
      EditUserUseCaseResponseDTO,
      EditUserViewModel
    >
{
  convertToUseCaseDTO(req: FastifyRequest): EditUserUseCaseRequestDTO {
    const { id } = editUserPathParametersSchema.parse(req.params);
    const { email, name } = editUserPayloadSchema.parse(req.body);

    const authUserId = req.userId;

    return {
      id,
      email,
      name,
      authUserId,
    };
  }

  async sendResponse(
    res: FastifyReply,
    useCaseResponseModel: EditUserUseCaseResponseDTO
  ) {
    return res.status(200).send(this.convertToViewModel(useCaseResponseModel));
  }

  convertToViewModel(model: EditUserUseCaseResponseDTO): EditUserViewModel {
    return {
      id: model.user.id.toString(),
      name: model.user.name,
      email: model.user.email,
      taxVat: model.user.taxVat.number,
      createdAt: model.user.createdAt.toISOString(),
      updatedAt: model.user.updatedAt?.toISOString(),
    };
  }
}

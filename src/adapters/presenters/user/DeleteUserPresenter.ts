import { FastifyReply, FastifyRequest } from "fastify";

import { deleteUserPathParametersSchema } from "@/adapters/controllers/user/schemas/DeleteUserSchema";
import { DeleteUserUseCaseRequestDTO } from "@/core/useCases/user/dto/DeleteUserUseCaseDTO";

import { ErrorHandlingPresenter } from "../base/ErrorHandlingPresenter";
import { IControllerPresenter } from "../base/IControllerPresenter";

export class DeleteUserPresenter
  extends ErrorHandlingPresenter
  implements IControllerPresenter<DeleteUserUseCaseRequestDTO, void, null>
{
  convertToUseCaseDTO(req: FastifyRequest): DeleteUserUseCaseRequestDTO {
    const { id } = deleteUserPathParametersSchema.parse(req.params);

    const authUserId = req.userId;

    return {
      id,
      authUserId: authUserId!,
    };
  }

  async sendResponse(res: FastifyReply) {
    return res.status(200).send({
      message: "User deleted successfully",
    });
  }
}

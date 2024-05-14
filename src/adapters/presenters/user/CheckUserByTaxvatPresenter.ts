import { FastifyReply, FastifyRequest } from "fastify";

import { checkUserByTaxvatQueryParamsSchema } from "@/adapters/controllers/user/schemas/CheckUserByTaxvatSchema";
import { CheckUserByTaxvatViewModel } from "@/adapters/controllers/user/viewModels/CheckUserByTaxvatViewModel";
import {
  CheckUserByTaxvatUseCaseRequestDTO,
  CheckUserByTaxvatUseCaseResponseDTO,
} from "@/core/useCases/user/dto/CheckUserByTaxvatUseCaseDTO";

import { ErrorHandlingPresenter } from "../base/ErrorHandlingPresenter";
import { IControllerPresenter } from "../base/IControllerPresenter";

export class CheckUserByTaxvatPresenter
  extends ErrorHandlingPresenter
  implements
    IControllerPresenter<
      CheckUserByTaxvatUseCaseRequestDTO,
      CheckUserByTaxvatUseCaseResponseDTO,
      CheckUserByTaxvatViewModel
    >
{
  convertToUseCaseDTO(req: FastifyRequest): CheckUserByTaxvatUseCaseRequestDTO {
    const { taxvat } = checkUserByTaxvatQueryParamsSchema.parse(req.query);

    return {
      taxvat,
    };
  }

  convertToViewModel({
    exist,
  }: CheckUserByTaxvatUseCaseResponseDTO): CheckUserByTaxvatViewModel {
    return {
      exist,
    };
  }

  async sendResponse(
    res: FastifyReply,
    useCaseResponseModel: CheckUserByTaxvatUseCaseResponseDTO
  ) {
    return res.status(200).send(this.convertToViewModel(useCaseResponseModel));
  }
}

import { FastifyReply, FastifyRequest } from "fastify";

import { AuthenticatePresenter } from "@/adapters/presenters/auth/AuthenticatePresenter";
import { RegisterPresenter } from "@/adapters/presenters/auth/RegisterPresenter";
import { IAuthUseCase } from "@/core/useCases/auth/IAuthUseCase";

export class AuthController {
  constructor(
    private authUseCase: IAuthUseCase,

    private registerPresenter: RegisterPresenter,
    private authenticatePresenter: AuthenticatePresenter
  ) {}

  async register(req: FastifyRequest, res: FastifyReply): Promise<void> {
    return this.authUseCase
      .register(this.registerPresenter.convertToUseCaseDTO(req))
      .then((response) => this.registerPresenter.sendResponse(res, response))
      .catch((error) =>
        this.registerPresenter.convertErrorResponse(error, res)
      );
  }

  async authenticate(req: FastifyRequest, res: FastifyReply): Promise<void> {
    return this.authUseCase
      .authenticate(this.authenticatePresenter.convertToUseCaseDTO(req))
      .then((response) =>
        this.authenticatePresenter.sendResponse(res, response)
      )
      .catch((error) =>
        this.authenticatePresenter.convertErrorResponse(error, res)
      );
  }
}

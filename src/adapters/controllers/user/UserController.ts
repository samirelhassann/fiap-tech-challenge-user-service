import { FastifyReply, FastifyRequest } from "fastify";

import { CheckUserByTaxvatPresenter } from "@/adapters/presenters/user/CheckUserByTaxvatPresenter";
import { EditUserPresenter } from "@/adapters/presenters/user/EditUserPresenter";
import { GetUserByIdPresenter } from "@/adapters/presenters/user/GetUserByIdPresenter";
import { GetUsersPresenter } from "@/adapters/presenters/user/GetUsersPresenter";
import { IUserUseCase } from "@/core/useCases/user/IUserUseCase";

import { CheckUserByTaxvatViewModel } from "./viewModels/CheckUserByTaxvatViewModel";
import { EditUserViewModel } from "./viewModels/EditUserViewModel";
import { GetUserByIdViewModel } from "./viewModels/GetUserByIdViewModel";
import { GetUsersViewModel } from "./viewModels/GetUsersViewModel";

export class UserController {
  constructor(
    private userUseCase: IUserUseCase,

    private getUsersPresenter: GetUsersPresenter,
    private getUserByIdPresenter: GetUserByIdPresenter,
    private editUserPresenter: EditUserPresenter,
    private checkUserByTaxvatPresenter: CheckUserByTaxvatPresenter
  ) {}

  async getUsers(
    req: FastifyRequest,
    res: FastifyReply
  ): Promise<GetUsersViewModel> {
    return this.userUseCase
      .getUsers(this.getUsersPresenter.convertToUseCaseDTO(req))
      .then((response) => this.getUsersPresenter.sendResponse(res, response))
      .catch((error) =>
        this.getUsersPresenter.convertErrorResponse(error, res)
      );
  }

  async checkUserByTaxvat(
    req: FastifyRequest,
    res: FastifyReply
  ): Promise<CheckUserByTaxvatViewModel> {
    return this.userUseCase
      .checkByTaxvat(this.checkUserByTaxvatPresenter.convertToUseCaseDTO(req))
      .then((response) =>
        this.checkUserByTaxvatPresenter.sendResponse(res, response)
      )
      .catch((error) =>
        this.checkUserByTaxvatPresenter.convertErrorResponse(error, res)
      );
  }

  async getUserById(
    req: FastifyRequest,
    res: FastifyReply
  ): Promise<GetUserByIdViewModel> {
    return this.userUseCase
      .getUserById(this.getUserByIdPresenter.convertToUseCaseDTO(req))
      .then((response) => this.getUserByIdPresenter.sendResponse(res, response))
      .catch((error) =>
        this.getUserByIdPresenter.convertErrorResponse(error, res)
      );
  }

  async editUser(
    req: FastifyRequest,
    res: FastifyReply
  ): Promise<EditUserViewModel> {
    return this.userUseCase
      .editUser(this.editUserPresenter.convertToUseCaseDTO(req))
      .then((response) => this.editUserPresenter.sendResponse(res, response))
      .catch((error) =>
        this.editUserPresenter.convertErrorResponse(error, res)
      );
  }
}

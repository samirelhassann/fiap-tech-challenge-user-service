import { FastifyInstance } from "fastify";

import { checkUserByTaxvatDocSchema } from "@/adapters/controllers/user/schemas/CheckUserByTaxvatSchema";
import { editUserDocSchema } from "@/adapters/controllers/user/schemas/EditUserSchema";
import { getUserByIdDocSchema } from "@/adapters/controllers/user/schemas/GetUserByIdSchema";
import { getUsersDocSchema } from "@/adapters/controllers/user/schemas/GetUsersSchema";
import { UserController } from "@/adapters/controllers/user/UserController";
import verifyJwt from "@/adapters/middlewares/verifyJwt";
import { CheckUserByTaxvatPresenter } from "@/adapters/presenters/user/CheckUserByTaxvatPresenter";
import { CreateUserPresenter } from "@/adapters/presenters/user/CreateUserPresenter";
import { EditUserPresenter } from "@/adapters/presenters/user/EditUserPresenter";
import { GetUserByIdPresenter } from "@/adapters/presenters/user/GetUserByIdPresenter";
import { GetUsersPresenter } from "@/adapters/presenters/user/GetUsersPresenter";
import { makeUserRepository } from "@/adapters/repositories/PrismaRepositoryFactory";
import { UserUseCase } from "@/core/useCases/user/UserUseCase";

export async function UserRoutes(app: FastifyInstance) {
  const userController = new UserController(
    new UserUseCase(makeUserRepository()),

    new GetUsersPresenter(),
    new GetUserByIdPresenter(),
    new CreateUserPresenter(),
    new EditUserPresenter(),
    new CheckUserByTaxvatPresenter()
  );

  app.get("", {
    schema: getUsersDocSchema,
    handler: userController.getUsers.bind(userController),
  });

  app.get("/:id", {
    schema: getUserByIdDocSchema,
    handler: userController.getUserById.bind(userController),
  });

  app.get("/check-taxvat", {
    schema: checkUserByTaxvatDocSchema,
    handler: userController.checkUserByTaxvat.bind(userController),
  });

  app.put("/:id", {
    schema: editUserDocSchema,
    handler: userController.editUser.bind(userController),
    preHandler: [verifyJwt()],
  });
}

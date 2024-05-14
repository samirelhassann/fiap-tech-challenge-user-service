import { FastifyInstance } from "fastify";

import identifyRequest from "@/adapters/middlewares/identifyRequest";

import { AuthRoutes } from "../routes/AuthRoutes";
import { UserRoutes } from "../routes/UserRoutes";

const SERVICE_PREFIX = "/user-service";

export function routes(app: FastifyInstance) {
  app.addHook("preHandler", identifyRequest);

  app.register(AuthRoutes, { prefix: `${SERVICE_PREFIX}` });
  app.register(UserRoutes, { prefix: `${SERVICE_PREFIX}/users` });
}

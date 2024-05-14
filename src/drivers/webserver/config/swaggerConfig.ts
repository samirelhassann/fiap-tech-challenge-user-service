import { FastifyInstance } from "fastify";

import Swagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import { version } from "../../../../package.json";

const SWAGGER_PATH = "/docs-swagger";

export function swaggerConfig(app: FastifyInstance) {
  app.register(Swagger, {
    openapi: {
      info: {
        title: "Tech Challenge #04 - User Service",
        description: "API Documentation for the User Service",
        version,
      },
    },
  });

  app.register(fastifySwaggerUi, {
    routePrefix: SWAGGER_PATH,
  });
}

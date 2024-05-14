import { FastifyInstance } from "fastify";

import fastifyCookie from "@fastify/cookie";

export function cookieConfig(app: FastifyInstance) {
  app.register(fastifyCookie);
}

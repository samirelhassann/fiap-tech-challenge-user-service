import { FastifyInstance } from "fastify";

import { env } from "@/config/env";
import fastifyJwt from "@fastify/jwt";

export function jwtConfig(app: FastifyInstance) {
  app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: "refreshToken",
      signed: false,
    },
    sign: {
      expiresIn: "1d",
    },
  });
}

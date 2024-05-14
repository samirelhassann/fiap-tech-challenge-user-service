/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-console */

import { FastifyInstance } from "fastify";
import { ZodError } from "zod";

import { env } from "@/config/env";

export function errorHandling(app: FastifyInstance) {
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      // eslint-disable-next-line consistent-return, array-callback-return

      const errors = error.issues.map((issue) => {
        if (issue.code.toLowerCase().indexOf("invalid") !== -1) {
          return `field(s) '${issue.path.join(
            ","
          )}' ${issue.message.toLowerCase()}`;
        }

        if (issue.code === "unrecognized_keys") {
          return `field(s) '${issue.keys.join(",")}' not recognized`;
        }
      });

      return reply.code(400).send({ message: "Validation error.", errors });
    }

    if (env.NODE_ENV !== "prod") {
      // eslint-disable-next-line no-console
      console.error(error);
    } else {
      // TODO: Add more details to the error
    }

    return reply.code(500).send({ message: error.message });
  });
}

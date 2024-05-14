import { FastifyInstance } from "fastify";
import fs from "fs";

const REDOC_PATH = "/docs";

export function redocConfig(app: FastifyInstance) {
  app.get(REDOC_PATH, (_, response) => {
    const stream = fs.createReadStream(`${process.cwd()}/index.html`);

    response.type("text/html").send(stream);
  });
}

/* eslint-disable no-console */
import packageInfo from "@/../package.json";
import { env } from "@/config/env";

import { app } from "./app";

const url = `http://localhost:${env.PORT}`;

app
  .listen({
    host: "0.0.0.0",
    port: env.PORT,
  })
  .then(() => {
    console.log("---------------------------------");
    console.log(`📦 App: ${packageInfo.name}`);
    console.log("");
    console.log(`🚀 HTTP Server Running: http://localhost:${env.PORT}/`);
    console.log(`📃 Swagger: ${url}${env.SWAGGER_DOCS_URL}`);
    console.log(`📃 Redoc: ${url}${env.REDOC_URL}`);

    console.log("---------------------------------");
    // console.log(`• [LOG] - Env variables`, JSON.stringify(env, null, 2));
  });

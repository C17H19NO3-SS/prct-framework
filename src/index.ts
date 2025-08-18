import { Elysia, ERROR_CODE } from "elysia";
import type { Server } from "elysia/universal/server";
import chalk from "chalk";
import { CreateCache, SetupBuilder } from "./Builder/Builder";
import { redis } from "bun";
import { readFileSync } from "fs";
import path from "path";
import { ApiEndpoint } from "./Api";
import { renderToReadableStream } from "react-dom/server";
import { _404 } from "./ErrorPages/404";
import { ErrorPages } from "./Controllers/ErrorPages";

CreateCache();
SetupBuilder();

new Elysia()
  .use(ApiEndpoint)
  .all("/:page?", async () => {
    if (process.env.USE_REDIS)
      return new Response(await redis.get("react-code"), {
        headers: {
          "Content-Type": "text/html",
        },
      });
    else if (global?.bundle)
      return new Response(global?.bundle, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    else
      return new Response(
        readFileSync(path.join(process.cwd(), "build", "bundle.html")),
        {
          headers: {
            "Content-Type": "text/html",
          },
        }
      );
  })
  .onError((params) => ErrorPages(params))
  .listen(3000, (server: Server) => {
    console.log(
      chalk.green`---------------------------------------------------`
    );
    console.log(chalk.green(`Server started on ${server.url}`));
    console.log(chalk.green(`Swagger started on ${server.url}swagger`));
    console.log(chalk.green(`Api started on ${server.url}api`));
    console.log(
      chalk.green`---------------------------------------------------`
    );
  });

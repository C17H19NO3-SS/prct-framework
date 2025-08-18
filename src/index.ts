import chalk from "chalk";
import path from "path";
import { Elysia } from "elysia";
import { CreateCache, SetupBuilder } from "./Builder/Builder";
import { redis } from "bun";
import { readFileSync } from "fs";
import { ApiEndpoint } from "./Api";
import { _404 } from "./ErrorPages/404";
import { ErrorPages } from "./Controllers/ErrorPages";
import { staticPlugin } from "@elysiajs/static";
import type { Server } from "elysia/universal/server";

CreateCache();
SetupBuilder();

new Elysia()
  .use(ApiEndpoint)
  .use(
    staticPlugin({
      prefix: "/assets",
      assets: path.join(process.cwd(), "src", "Static"),
    })
  )
  .all("/:page?", async () => {
    if (process.env.USE_REDIS === "true")
      return new Response(await redis.get("react-code"), {
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

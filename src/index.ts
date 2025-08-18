import { Elysia } from "elysia";
import type { Server } from "elysia/universal/server";
import chalk from "chalk";
import { CreateCache, SetupBuilder } from "./builder/Builder";
import { redis } from "bun";
import { readFileSync } from "fs";
import path from "path";

CreateCache();
SetupBuilder();

new Elysia()
  .all(
    "/:page?",
    async () =>
      new Response(
        process.env.USE_REDIS === "true"
          ? await redis.get("react-code")
          : readFileSync(
              path.join(process.cwd(), "build", "bundle.html")
            ).toString() || "",
        {
          headers: {
            "Content-Type": "text/html",
          },
        }
      )
  )
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

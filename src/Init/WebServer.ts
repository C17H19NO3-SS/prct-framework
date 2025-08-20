import chalk from "chalk";
import staticPlugin from "@elysiajs/static";
import fs from "fs";
import path from "path";
import Bun from "bun";
import { routes } from "../../Views/src/main.tsx";
import { ApiEndpoint } from "../Api";
import { ErrorPages } from "../Controllers/ErrorPages";
import type { Server } from "elysia/universal";
import type Elysia from "elysia";

const indexHtml = Bun.gzipSync(
  fs
    .readFileSync(path.join(process.cwd(), "react-build", "index.html"))
    .toString(),
  {
    level: 9,
  }
);

export const InitWebServer = (app: Elysia): void => {
  routes.forEach(({ path: p }) => {
    app.get(
      p,
      () =>
        new Response(indexHtml, {
          headers: {
            "Content-Type": "text/html",
            "Content-Encoding": "gzip",
          },
        })
    );
  });

  // Serve static files under /build
  app
    .use(
      staticPlugin({
        assets: "react-build",
        prefix: "/",
        indexHTML: true,
      })
    )

    // Register API endpoints
    .use(ApiEndpoint)

    // Global error handler
    .onError((params) => ErrorPages(params))

    // Start server
    .listen(3000, (server: Server) => {
      console.log(
        chalk.green`-----------------------------------------------------------`
      );
      console.log(chalk.green(`✅ Server started on:    ${server.url}`));
      console.log(chalk.green(`📘 Swagger available at: ${server.url}swagger`));
      console.log(chalk.green(`📡 API available at:     ${server.url}api`));
      console.log(
        chalk.green`-----------------------------------------------------------`
      );
    });
};

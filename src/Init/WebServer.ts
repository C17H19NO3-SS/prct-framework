import staticPlugin from "@elysiajs/static";
import type Elysia from "elysia";
import { ApiEndpoint } from "../Api";
import { ErrorPages } from "../Controllers/ErrorPages";
import type { Server } from "elysia/universal";
import chalk from "chalk";

export const InitWebServer = (app: Elysia): void => {
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

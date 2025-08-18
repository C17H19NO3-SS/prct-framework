import chalk from "chalk";
import path from "path";
import { Elysia, file } from "elysia";
import { CreateCache, SetupBuilder } from "./Builder/Builder";
import { redis } from "bun";
import { readFileSync } from "fs";
import { ApiEndpoint } from "./Api";
import { ErrorPages } from "./Controllers/ErrorPages";
import { staticPlugin } from "@elysiajs/static";
import type { Server } from "elysia/universal/server";

// Initialize cache (SSR + bundle generation)
CreateCache();
SetupBuilder();

/**
 * Main server configuration
 */
new Elysia()
  // Serve the bundled React script
  .get(
    "/assets/react.mjs",
    file(path.join(process.cwd(), "build", "react.mjs"))
  )

  // Register API endpoints
  .use(ApiEndpoint)

  // Serve static files under /assets
  .use(
    staticPlugin({
      prefix: "/assets",
      assets: path.join(process.cwd(), "src", "Static"),
    })
  )

  // Catch-all route (SSR HTML response)
  .all("/:page?", async () => {
    if (process.env.USE_REDIS === "true") {
      // Fetch HTML from Redis
      return new Response(await redis.get("react-code"), {
        headers: { "Content-Type": "text/html" },
      });
    } else {
      // Fallback: read HTML from local build directory
      return new Response(
        readFileSync(path.join(process.cwd(), "build", "bundle.html")),
        { headers: { "Content-Type": "text/html" } }
      );
    }
  })

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

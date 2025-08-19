import path from "path";
import { redis } from "bun";
import { renderToReadableStream } from "react-dom/server";
import { build } from "esbuild";
import { existsSync, mkdirSync, watch, writeFileSync } from "fs";
import { App } from "../../Views/main";
import chalk from "chalk";

/**
 * Initializes the builder process.
 * Refreshes the cache every 30 minutes.
 */
export const SetupBuilder = async () => {
  try {
    if (process.env.PRCT_ENVIRONMENT === "development") {
      watch(
        path.join(process.cwd(), "Views"),
        {
          recursive: true,
        },
        (event, fn) => {
          if (event === "change") {
            console.log(chalk.yellow(`Değiştirilen dosya: ${fn}`));
            CreateCache();
          }
        }
      );
    }
    setInterval(CreateCache, 30 * 60 * 1000); // 30 minutes
  } catch (error) {}
};

/**
 * Builds the React component and stores it in cache.
 * - If Redis is enabled, stores it in Redis.
 * - Otherwise, writes it to the local build directory.
 */
export const CreateCache = async () => {
  // Build the client-side React bundle
  const buildResult = await build({
    entryPoints: [path.join(process.cwd(), "Views", "index.tsx")],
    bundle: true,
    write: false,
    format: "esm",
    minify: true,
    minifySyntax: true,
    minifyIdentifiers: true,
    minifyWhitespace: true,
  });

  const bundledScript = buildResult.outputFiles[0]?.text;

  // Save bundled script to the build directory
  writeFileSync(
    path.join(process.cwd(), "build", "react.js"),
    bundledScript as string
  );

  // Render the React app with SSR
  const stream = await renderToReadableStream(<App />);
  const reader = stream.getReader();
  const { value: renderedHtml } = await reader.read();

  if (process.env.USE_REDIS === "true") {
    // Save rendered HTML to Redis
    await redis.set("react-code", renderedHtml);
    await redis.expire("react-code", 3600); // 1 hour expiration
  } else {
    // Save rendered HTML as a file in the build directory
    const buildPath = path.join(process.cwd(), "build");
    if (!existsSync(buildPath)) mkdirSync(buildPath);

    writeFileSync(path.join(buildPath, "bundle.html"), renderedHtml);
  }
};

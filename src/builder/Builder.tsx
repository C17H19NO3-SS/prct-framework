import path from "path";
import { redis } from "bun";
import { renderToReadableStream } from "react-dom/server";
import { build } from "esbuild";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { App } from "../Views/main";

export const SetupBuilder = async () =>
  setInterval(CreateCache, 30 * 60 * 1000);

export const CreateCache = async () => {
  const script = (
    await build({
      entryPoints: [path.join(process.cwd(), "src", "views", "index.tsx")],
      bundle: true,
      write: false,
      format: "esm",
      minify: true,
      minifySyntax: true,
      minifyIdentifiers: true,
      minifyWhitespace: true,
    })
  ).outputFiles[0]?.text;

  writeFileSync(
    path.join(process.cwd(), "src", "Static", "react.mjs"),
    script as string
  );

  const code = await renderToReadableStream(<App />);

  if (process.env.USE_REDIS === "true") {
    await redis.set("react-code", (await code.getReader().read()).value);

    await redis.expire("react-code", 3600);
  } else {
    const buildPath = path.join(process.cwd(), "build");

    if (!existsSync(buildPath)) mkdirSync(buildPath);
    const text = (await code.getReader().read()).value;
    writeFileSync(path.join(buildPath, "bundle.html"), text);
  }
};

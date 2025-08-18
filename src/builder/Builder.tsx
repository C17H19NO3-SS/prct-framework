import path from "path";
import { redis } from "bun";
import { renderToReadableStream } from "react-dom/server";
import { build } from "esbuild";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { App } from "../Views/main";

export const SetupBuilder = async () =>
  setInterval(CreateCache, 30 * 60 * 1000);

export const CreateCache = async () => {
  const Scripts = async () =>
    (
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
    ).outputFiles.map((v, i) => (
      <script type="module" key={i}>
        {v.text}
      </script>
    ));

  const code = await renderToReadableStream(<App {...{ Scripts }} />);

  if (process.env.USE_REDIS === "true") {
    await redis.set("react-code", (await code.getReader().read()).value);

    await redis.expire("react-code", 3600);
  } else {
    const buildPath = path.join(process.cwd(), "build");

    if (!existsSync(buildPath)) mkdirSync(buildPath);
    const text = (await code.getReader().read()).value;
    writeFileSync(path.join(buildPath, "bundle.html"), text);

    global.bundle = text;
  }
};

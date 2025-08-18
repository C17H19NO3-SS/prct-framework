import path from "path";
import { redis } from "bun";
import { renderToReadableStream } from "react-dom/server";
import { build } from "esbuild";
import { existsSync, mkdir, mkdirSync, writeFileSync } from "fs";

export const SetupBuilder = async () =>
  setInterval(CreateCache, 30 * 60 * 1000);

export const CreateCache = async () => {
  const PageContent = async (): Promise<React.ReactNode> => (
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        {(
          await build({
            entryPoints: [
              path.join(process.cwd(), "src", "views", "index.tsx"),
            ],
            bundle: true,
            write: false,
            format: "esm",
            minify: true,
            minifySyntax: true,
            minifyIdentifiers: true,
            minifyWhitespace: true,
          })
        ).outputFiles.map((v, i) => (
          <script key={i} type="module">
            {v.text}
          </script>
        ))}
      </body>
    </html>
  );

  const code = await renderToReadableStream(<PageContent />);

  if (process.env.USE_REDIS === "true") {
    await redis.set("react-code", (await code.getReader().read()).value);

    await redis.expire("react-code", 3600);
  } else {
    const buildPath = path.join(process.cwd(), "build");

    if (!existsSync(buildPath)) mkdirSync(buildPath);

    writeFileSync(
      path.join(buildPath, "bundle.html"),
      (await code.getReader().read()).value
    );
  }
};

import { build, createServer, type ViteDevServer } from "vite";
import path from "path";
import chalk from "chalk";

// =============================================================================
// TİP TANIMLARI
// =============================================================================

interface ViteOptions {
  root?: string;
  configFile?: string | false;
  mode?: string;
  define?: Record<string, any>;
  plugins?: any[];
  base?: string;
  publicDir?: string;
  build?: {
    outDir?: string;
    assetsDir?: string;
    sourcemap?: boolean;
    minify?: boolean;
  };
}

interface DevServerOptions extends ViteOptions {
  host?: string | boolean;
  port?: number;
  open?: boolean | string;
  cors?: boolean;
  strictPort?: boolean;
}

// =============================================================================
// FONKSİYON YAKLAŞIMI
// =============================================================================

/**
 * Vite build işlemini başlatır
 * @param options - Vite build seçenekleri
 * @returns Promise<void>
 */
export async function viteBuild(options: ViteOptions = {}): Promise<void> {
  try {
    console.log(
      chalk.green`-----------------------------------------------------------`
    );
    console.log(chalk.green`🔨 Build process is starting...`);

    const buildConfig = {
      root: options.root || path.join(process.cwd(), "Views"),
      mode: options.mode || "production",
      configFile: options.configFile,
      define: options.define,
      plugins: options.plugins,
      base: options.base || "/",
      publicDir: options.publicDir || "public",
      build: {
        outDir:
          options.build?.outDir || path.join(process.cwd(), "react-build"),
        assetsDir: options.build?.assetsDir || "assets",
        sourcemap: options.build?.sourcemap ?? false,
        minify: options.build?.minify ?? true,
        ...options.build,
      },
    };

    await build(buildConfig);
    console.log(chalk.green`✅ The build process was successfully completed.!`);
    console.log(
      chalk.green`-----------------------------------------------------------`
    );
  } catch (error) {
    console.error("❌ Error during build process:", error);
    process.exit(1);
  }
}

/**
 * Vite development server'ını başlatır
 * @param options - Dev server seçenekleri
 * @returns Promise<ViteDevServer>
 */
export async function viteDevServer(
  options: DevServerOptions = {}
): Promise<ViteDevServer> {
  try {
    console.log("🚀 Development server is starting...");

    const serverConfig = {
      root: options.root || path.join(process.cwd(), "Views"),
      mode: options.mode || "development",
      configFile: options.configFile,
      define: options.define,
      plugins: options.plugins,
      base: options.base || "/",
      publicDir: options.publicDir || "public",
      server: {
        host: options.host || "localhost",
        port: options.port || 3001,
        open: options.open ?? false,
        cors: options.cors ?? true,
        strictPort: options.strictPort ?? false,
      },
    };

    const server = await createServer(serverConfig);
    await server.listen();

    const info = server.config.logger.info;
    info(`\n  🎉 Development server ready!`);
    info(`  ➜  Local:   http://localhost:${server.config.server.port}/`);

    return server;
  } catch (error) {
    console.error("❌ Error while starting development server:", error);
    process.exit(1);
  }
}

/**
 * Komut satırından kullanım için yardımcı fonksiyon
 */
export async function runVite(command: "dev" | "build", options: any = {}) {
  switch (command) {
    case "dev":
      await viteDevServer(options);
      break;
    case "build":
      await viteBuild(options);
      break;
    default:
      console.error(
        `Geçersiz komut: ${command}. Available commands: dev, build`
      );
  }
}

// Komut satırından çalıştırma
if (require.main === module) {
  const command = process.argv[2] as "dev" | "build";
  const port = process.argv[3] ? parseInt(process.argv[3]) : undefined;

  runVite(command, { port }).catch(console.error);
}

// Export all
export default { viteBuild, viteDevServer, runVite };

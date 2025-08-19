import { build, createServer, type ViteDevServer } from "vite";
import path from "path";

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
    console.log("🔨 Build işlemi başlatılıyor...");

    const buildConfig = {
      root: options.root || path.join(process.cwd(), "Views"),
      mode: options.mode || "production",
      configFile: options.configFile,
      define: options.define,
      plugins: options.plugins,
      base: options.base || "/",
      publicDir: options.publicDir || "public",
      build: {
        outDir: options.build?.outDir || "dist",
        assetsDir: options.build?.assetsDir || "assets",
        sourcemap: options.build?.sourcemap ?? false,
        minify: options.build?.minify ?? true,
        ...options.build,
      },
    };

    await build(buildConfig);
    console.log("✅ Build işlemi başarıyla tamamlandı!");
  } catch (error) {
    console.error("❌ Build işlemi sırasında hata:", error);
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
    console.log("🚀 Development server başlatılıyor...");

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
    info(`\n  🎉 Development server hazır!`);
    info(`  ➜  Local:   http://localhost:${server.config.server.port}/`);

    return server;
  } catch (error) {
    console.error("❌ Development server başlatılırken hata:", error);
    process.exit(1);
  }
}

// =============================================================================
// CLASS YAKLAŞIMI (OPSİYONEL)
// =============================================================================

/**
 * Vite işlemlerini yöneten ana sınıf
 */
export class ViteManager {
  private defaultOptions: ViteOptions;
  private devServer?: ViteDevServer;

  constructor(defaultOptions: ViteOptions = {}) {
    this.defaultOptions = {
      root: process.cwd(),
      mode: "development",
      base: "/",
      publicDir: "public",
      ...defaultOptions,
    };
  }

  /**
   * Build işlemini başlatır
   */
  async build(customOptions: ViteOptions = {}): Promise<void> {
    const options = { ...this.defaultOptions, ...customOptions };
    await viteBuild(options);
  }

  /**
   * Development server'ını başlatır
   */
  async startDevServer(
    customOptions: DevServerOptions = {}
  ): Promise<ViteDevServer> {
    const options = { ...this.defaultOptions, ...customOptions };
    this.devServer = await viteDevServer(options);
    return this.devServer;
  }

  /**
   * Development server'ını durdurur
   */
  async stopDevServer(): Promise<void> {
    if (this.devServer) {
      await this.devServer.close();
      console.log("🛑 Development server durduruldu");
    }
  }

  /**
   * Server'ın çalışıp çalışmadığını kontrol eder
   */
  isDevServerRunning(): boolean {
    return !!this.devServer && !!this.devServer.httpServer?.listening;
  }
}

/**
 * Komut satırından kullanım için yardımcı fonksiyon
 */
export async function runViteCommand(
  command: "dev" | "build",
  options: any = {}
) {
  switch (command) {
    case "dev":
      await viteDevServer(options);
      break;
    case "build":
      await viteBuild(options);
      break;
    default:
      console.error(
        `Geçersiz komut: ${command}. Kullanılabilir komutlar: dev, build`
      );
  }
}

// Komut satırından çalıştırma
if (require.main === module) {
  const command = process.argv[2] as "dev" | "build";
  const port = process.argv[3] ? parseInt(process.argv[3]) : undefined;

  runViteCommand(command, { port }).catch(console.error);
}

// Export all
export default { viteBuild, viteDevServer, ViteManager, runViteCommand };

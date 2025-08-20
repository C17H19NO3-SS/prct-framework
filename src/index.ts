import { Elysia } from "elysia";
import { runVite } from "./builder/Builder.ts";
import { InitWebServer } from "./Init/WebServer.ts";
// import { ExtensionManager } from "./Init/Extensions.ts";

await runVite(process.env.PRCT_ENVIRONMENT === "development" ? "dev" : "build");

/**
 * Main server configuration
 */
const app = new Elysia();

// await ExtensionManager.InitExtensions(app);

// Inıtialize web server
InitWebServer(app);

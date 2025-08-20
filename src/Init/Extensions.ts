// import path from "path";
// import fs from "fs";
// import type Elysia from "elysia";
// import type { Extension } from "../types/extension";

// export class ExtensionManager {
//   private AllExtensions: Map<string, Extension>;
//   private ExtensionsPath: string;

//   constructor() {
//     this.ExtensionsPath = path.join(process.cwd(), "Extensions");
//     this.AllExtensions = new Map();

//     fs.readdirSync(this.ExtensionsPath).forEach((v) => this.LoadExtension(v));
//   }

//   static async InitExtensions(app: Elysia): Promise<void> {
//     new ExtensionManager();
//   }

//   LoadExtension(path: string) {}
// }

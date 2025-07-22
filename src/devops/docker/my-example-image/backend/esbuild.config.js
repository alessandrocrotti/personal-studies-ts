import { build } from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import { rmSync, mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

// Supporto per __dirname (non disponibile in ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");
const distDir = join(__dirname, "dist");

// Rimuove e ricrea dist/
try {
  rmSync(distDir, { recursive: true, force: true });
  mkdirSync(distDir);
  console.log("🧼 Cartella dist pulita");
} catch (err) {
  console.error("❌ Errore durante la pulizia:", err);
}

// Processo di build
build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  sourcemap: true,
  minify: false,
  plugins: [nodeExternalsPlugin()],
  logLevel: "info",
}).catch(() => process.exit(1));

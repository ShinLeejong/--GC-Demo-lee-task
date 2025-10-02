import { mkdirSync, copyFileSync, existsSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const src = resolve(__dirname, "../../../packages/limejs/dist/limejs.umd.js");
const destDir = resolve(__dirname, "../public/static");
const dest = join(destDir, "limejs.umd.js");

mkdirSync(destDir, { recursive: true });
if (!existsSync(src)) {
  throw new Error(`limejs UMD를 찾을 수 없습니다: ${src}`);
}
copyFileSync(src, dest);
console.log("[predev] Copied limejs UMD ->", dest);

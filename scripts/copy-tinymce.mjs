import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "node_modules", "tinymce");
const target = join(root, "public", "tinymce");

if (!existsSync(source)) {
  process.exit(0);
}

mkdirSync(dirname(target), { recursive: true });
rmSync(target, { recursive: true, force: true });
cpSync(source, target, { recursive: true });

import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";

const defaultBudgetBytes = 30 * 1024;

export function measureCss(source) {
  return {
    gzipBytes: gzipSync(source, { level: 9 }).byteLength,
    rawBytes: Buffer.byteLength(source, "utf8"),
  };
}

export function evaluateBudget({ budgetBytes, gzipBytes, rawBytes }) {
  return {
    budgetBytes,
    gzipBytes,
    ok: gzipBytes <= budgetBytes,
    rawBytes,
  };
}

async function listCssFiles(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...await listCssFiles(entryPath));
    else if (entry.isFile() && entry.name.endsWith(".css")) files.push(entryPath);
  }
  return files;
}

export async function readCssSource(inputPath) {
  const input = await stat(inputPath);
  if (input.isFile()) {
    const source = await readFile(inputPath, "utf8");
    if (source.trim().length === 0) throw new Error(`No hay archivos CSS en ${inputPath}.`);
    return source;
  }
  if (!input.isDirectory()) {
    throw new Error(`La entrada CSS debe ser un archivo o directorio: ${inputPath}.`);
  }

  const files = (await listCssFiles(inputPath)).sort();
  if (files.length === 0) throw new Error(`No hay archivos CSS en ${inputPath}.`);
  const source = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  if (source.trim().length === 0) throw new Error(`No hay archivos CSS en ${inputPath}.`);
  return source;
}

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

function isMissingCssSource(error) {
  return (error && typeof error === "object" && "code" in error && error.code === "ENOENT")
    || (error instanceof Error && error.message.startsWith("No hay archivos CSS en "));
}

async function main() {
  const inputPath = path.resolve(process.argv[2] ?? "storybook-static/assets");
  const budgetBytes = Number.parseInt(process.argv[3] ?? String(defaultBudgetBytes), 10);
  if (!Number.isFinite(budgetBytes) || budgetBytes <= 0) {
    throw new Error("El presupuesto CSS debe ser un número positivo de bytes.");
  }

  let source;
  try {
    source = await readCssSource(inputPath);
  } catch (error) {
    if (isMissingCssSource(error)) {
      throw new Error(`No se encontró CSS compilado en ${inputPath}. Ejecuta pnpm build-storybook primero.`);
    }
    throw error;
  }

  const result = evaluateBudget({ ...measureCss(source), budgetBytes });
  console.log(`Voreal CSS budget · ${inputPath}`);
  console.log(`Raw: ${formatKb(result.rawBytes)} · Gzip: ${formatKb(result.gzipBytes)} · Budget: ${formatKb(result.budgetBytes)}`);
  if (!result.ok) {
    console.error(`El CSS gzip excede el presupuesto por ${formatKb(result.gzipBytes - result.budgetBytes)}.`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}

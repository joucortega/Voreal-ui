import { readFile, readdir } from "node:fs/promises";
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

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

async function main() {
  const outputRoot = path.resolve(process.argv[2] ?? "storybook-static/assets");
  let files;
  try {
    files = (await listCssFiles(outputRoot)).sort();
  } catch {
    throw new Error(`No se encontró CSS compilado en ${outputRoot}. Ejecuta pnpm build-storybook primero.`);
  }
  if (files.length === 0) throw new Error(`No hay archivos CSS en ${outputRoot}.`);

  const source = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  const result = evaluateBudget({ ...measureCss(source), budgetBytes: defaultBudgetBytes });
  console.log(`Voreal CSS budget · ${files.length} archivo${files.length === 1 ? "" : "s"}`);
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

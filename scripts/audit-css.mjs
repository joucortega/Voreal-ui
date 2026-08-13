import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const supportedExtensions = new Set([".css", ".scss", ".sass", ".less", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const ignoredDirectories = new Set([".git", "dist", "node_modules", "playwright-report", "storybook-static", "test-results"]);

const rules = [
  { id: "raw-brand-color", pattern: /#(?:fff9ef|071b46|c83b20|ff5c35|39d353)\b/gi },
  { id: "important", pattern: /!important\b/g },
  { id: "arbitrary-color", pattern: /(?:bg|text|border)-\[#[0-9a-f]{3,8}\]/gi },
  { id: "raw-z-index", pattern: /z-index\s*:\s*[1-9][0-9]*/gi },
];

export function isPaletteAllowlisted(filePath) {
  const normalized = filePath.replaceAll("\\", "/");
  return normalized.includes("/themes/") || normalized.includes("/tokens/") || normalized.startsWith("src/themes/") || normalized.startsWith("src/tokens/");
}

function lineAndColumn(source, index) {
  const before = source.slice(0, index);
  const lines = before.split("\n");
  return { column: lines.at(-1).length + 1, line: lines.length };
}

export function findViolations(source) {
  return rules.flatMap((rule) => {
    const matches = Array.from(source.matchAll(rule.pattern), (match) => ({
      match: match[0],
      ...lineAndColumn(source, match.index),
    }));
    return matches.length > 0 ? [{ id: rule.id, matches }] : [];
  });
}

async function listFiles(root) {
  const absoluteRoot = path.resolve(root);
  const entries = await readdir(absoluteRoot, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(absoluteRoot, entry.name);
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) files.push(...await listFiles(entryPath));
    } else if (entry.isFile() && supportedExtensions.has(path.extname(entry.name))) {
      files.push(entryPath);
    }
  }

  return files;
}

export async function auditRoots(roots) {
  const findings = [];
  let scannedFiles = 0;
  for (const root of roots) {
    const files = await listFiles(root);
    scannedFiles += files.length;
    for (const file of files) {
      const source = await readFile(file, "utf8");
      const relative = path.relative(process.cwd(), file) || file;
      const violations = findViolations(source).filter((violation) => (
        violation.id !== "raw-brand-color" || !isPaletteAllowlisted(relative)
      ));
      if (violations.length > 0) findings.push({ file: relative, violations });
    }
  }
  return { findings, scannedFiles };
}

function parseArguments(argv) {
  const reportOnly = argv.includes("--report");
  const roots = argv.filter((argument) => !argument.startsWith("--"));
  return { reportOnly, roots: roots.length > 0 ? roots : ["src"] };
}

async function main() {
  const { reportOnly, roots } = parseArguments(process.argv.slice(2));
  const { findings, scannedFiles } = await auditRoots(roots);
  const occurrenceCount = findings.reduce((fileTotal, finding) => (
    fileTotal + finding.violations.reduce((total, violation) => total + violation.matches.length, 0)
  ), 0);

  console.log(`Voreal CSS audit · ${reportOnly ? "report" : "strict"} · ${roots.join(", ")}`);
  for (const finding of findings) {
    for (const violation of finding.violations) {
      for (const match of violation.matches) {
        console.log(`${finding.file}:${match.line}:${match.column} [${violation.id}] ${match.match}`);
      }
    }
  }
  console.log(`${occurrenceCount} violation${occurrenceCount === 1 ? "" : "s"} across ${scannedFiles} scanned file${scannedFiles === 1 ? "" : "s"}.`);

  if (!reportOnly && occurrenceCount > 0) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}

import { readFile, readdir, realpath } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import postcss from "postcss";

const layerOrder = ["vrn-reset", "vrn-tokens", "vrn-components", "vrn-patterns", "vrn-utilities"];
const exactLayerOrder = layerOrder.join(", ");
const bareElements = new Set(["html", "body", "button", "input", "select", "a", "h1", "h2", "h3", "h4", "h5", "h6"]);

function lineAndColumn(source, index) {
  const before = source.slice(0, index);
  const lines = before.split("\n");
  return { line: lines.length, column: lines.at(-1).length + 1 };
}

function finding(source, file, id, match, index) {
  return { file, id, match, ...lineAndColumn(source, index) };
}

/** Replaces comments and quoted contents with spaces while preserving offsets and newlines. */
function maskNonCode(source) {
  const output = [...source];
  let state = "code";
  let quote = "";

  for (let index = 0; index < source.length; index += 1) {
    const current = source[index];
    const next = source[index + 1];

    if (state === "comment") {
      if (current === "*" && next === "/") {
        output[index] = " ";
        output[index + 1] = " ";
        index += 1;
        state = "code";
      } else if (current !== "\n" && current !== "\r") {
        output[index] = " ";
      }
      continue;
    }

    if (state === "string") {
      if (current === "\\" && next !== undefined) {
        output[index] = " ";
        if (next !== "\n" && next !== "\r") output[index + 1] = " ";
        index += 1;
      } else if (current === quote) {
        output[index] = " ";
        state = "code";
      } else if (current !== "\n" && current !== "\r") {
        output[index] = " ";
      }
      continue;
    }

    if (current === "/" && next === "*") {
      output[index] = " ";
      output[index + 1] = " ";
      index += 1;
      state = "comment";
    } else if (current === "'" || current === '"') {
      output[index] = " ";
      state = "string";
      quote = current;
    }
  }

  return output.join("");
}

function matchesFor(source, masked, file, id, pattern) {
  return Array.from(masked.matchAll(pattern), (match) => finding(source, file, id, source.slice(match.index, match.index + match[0].length), match.index));
}

function readCssIdentifier(source, start) {
  let decoded = "";
  let index = start;
  while (index < source.length) {
    const character = source[index];
    if (/[\w-]/.test(character) || character.codePointAt(0) >= 0x80) {
      decoded += character;
      index += 1;
      continue;
    }
    if (character !== "\\" || source[index + 1] === undefined) break;
    const escaped = source.slice(index + 1).match(/^[0-9a-f]{1,6}/i)?.[0];
    if (escaped) {
      const codePoint = Number.parseInt(escaped, 16);
      const normalizedCodePoint = codePoint === 0 || codePoint > 0x10ffff || (codePoint >= 0xd800 && codePoint <= 0xdfff) ? 0xfffd : codePoint;
      decoded += String.fromCodePoint(normalizedCodePoint);
      index += 1 + escaped.length;
      if (/\s/.test(source[index] ?? "")) index += 1;
    } else {
      decoded += source[index + 1];
      index += 2;
    }
  }
  return { decoded, end: index };
}

function namespaceFindings(source, masked, file) {
  const violations = [];
  for (let index = 0; index < masked.length; index += 1) {
    if (masked[index] === ".") {
      const identifier = readCssIdentifier(masked, index + 1);
      const normalized = identifier.decoded.toLowerCase();
      if (normalized.startsWith("vr-") && !normalized.startsWith("vrn-")) {
        violations.push(finding(source, file, "legacy-class", source.slice(index, identifier.end), index));
      }
      index = Math.max(index, identifier.end - 1);
    } else if (masked.startsWith("--", index)) {
      const identifier = readCssIdentifier(masked, index);
      const normalized = identifier.decoded.toLowerCase();
      if (normalized.startsWith("--vr-") && !normalized.startsWith("--vrn-")) {
        violations.push(finding(source, file, "legacy-variable", source.slice(index, identifier.end), index));
      }
      index = Math.max(index, identifier.end - 1);
    }
  }
  return violations;
}

function zIndexFindings(source, file) {
  const violations = [];
  const root = postcss.parse(source, { from: file });
  root.walkDecls((declaration) => {
    const property = readCssIdentifier(declaration.prop, 0).decoded.toLowerCase();
    if (property !== "z-index") return;
    const value = maskNonCode(declaration.value).trim();
    // Voreal Next deliberately permits only the non-stacking `auto` keyword or
    // a named layer token. CSS-wide keywords (inherit, initial, revert, unset)
    // are valid CSS but are rejected because they bypass the local layer scale.
    const valid = /^auto$/i.test(value) || /^var\(\s*--vrn-layer-[\w-]+\s*\)$/.test(value);
    if (!valid) {
      const start = declaration.source.start.offset;
      const end = declaration.source.end.offset + 1;
      violations.push(finding(source, file, "raw-z-index", source.slice(start, end).trimEnd(), start));
    }
  });
  return violations;
}

function importantFindings(source, masked, file) {
  const violations = [];
  for (let index = 0; index < masked.length; index += 1) {
    if (masked[index] !== "!") continue;
    let identifierStart = index + 1;
    while (/\s/.test(masked[identifierStart] ?? "")) identifierStart += 1;
    const identifier = readCssIdentifier(masked, identifierStart);
    if (identifier.decoded.toLowerCase() === "important") {
      violations.push(finding(source, file, "important", source.slice(index, identifier.end), index));
      index = identifier.end - 1;
    }
  }
  return violations;
}

function splitSelectorList(selector, startIndex) {
  const parts = [];
  let squareDepth = 0;
  let roundDepth = 0;
  let partStart = 0;

  for (let index = 0; index < selector.length; index += 1) {
    const character = selector[index];
    if (character === "[") squareDepth += 1;
    else if (character === "]") squareDepth = Math.max(0, squareDepth - 1);
    else if (character === "(") roundDepth += 1;
    else if (character === ")") roundDepth = Math.max(0, roundDepth - 1);
    else if (character === "," && squareDepth === 0 && roundDepth === 0) {
      parts.push({ source: selector.slice(partStart, index), start: startIndex + partStart });
      partStart = index + 1;
    }
  }
  parts.push({ source: selector.slice(partStart), start: startIndex + partStart });
  return parts;
}

function selectorDepths(selector) {
  const depths = [];
  let depth = 0;
  let squareDepth = 0;
  for (let index = 0; index < selector.length; index += 1) {
    depths[index] = depth;
    if (selector[index] === "[") squareDepth += 1;
    else if (selector[index] === "]") squareDepth = Math.max(0, squareDepth - 1);
    else if (squareDepth === 0 && selector[index] === "(") depth += 1;
    else if (squareDepth === 0 && selector[index] === ")") depth = Math.max(0, depth - 1);
  }
  return depths;
}

function basicSelectorScopes(selector) {
  const scopes = [];
  for (const match of selector.matchAll(/\[data-voreal-ui\s*=|\[data-vrn-portal\b/gi)) {
    scopes.push({ index: match.index });
  }
  for (let index = 0; index < selector.length; index += 1) {
    if (selector[index] !== ".") continue;
    const identifier = readCssIdentifier(selector, index + 1);
    if (identifier.decoded.startsWith("vrn-")) scopes.push({ index });
    index = Math.max(index, identifier.end - 1);
  }
  return scopes;
}

function closingParenthesis(selector, opening) {
  let depth = 0;
  for (let index = opening; index < selector.length; index += 1) {
    if (selector[index] === "(") depth += 1;
    else if (selector[index] === ")") {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

function selectorBranchIsScoped(selector) {
  const depths = selectorDepths(selector);
  if (basicSelectorScopes(selector).some(({ index }) => (depths[index] ?? 0) === 0)) return true;
  return functionalSelectorScopes(selector).some(({ index }) => (depths[index] ?? 0) === 0);
}

function functionalSelectorScopes(selector) {
  const scopes = [];
  for (let index = 0; index < selector.length; index += 1) {
    if (selector[index] !== ":") continue;
    const pseudo = readCssIdentifier(selector, index + 1);
    if (pseudo.decoded.toLowerCase() !== "is" && pseudo.decoded.toLowerCase() !== "where") continue;
    let opening = pseudo.end;
    while (/\s/.test(selector[opening] ?? "")) opening += 1;
    if (selector[opening] !== "(") continue;
    const closing = closingParenthesis(selector, opening);
    if (closing < 0) continue;
    const contents = selector.slice(opening + 1, closing);
    const branches = splitSelectorList(contents, 0);
    if (branches.length > 0 && branches.every((branch) => selectorBranchIsScoped(branch.source))) scopes.push({ index });
    index = closing;
  }
  return scopes;
}

function selectorScopes(selector) {
  return [...basicSelectorScopes(selector), ...functionalSelectorScopes(selector)];
}

function scopeApplies(selector, tokenIndex) {
  const depths = selectorDepths(selector);
  const tokenDepth = depths[tokenIndex] ?? 0;
  const scopes = selectorScopes(selector);

  for (const scope of scopes) {
    const scopeIndex = scope.index;
    const scopeDepth = depths[scopeIndex] ?? 0;
    if (scopeIndex < tokenIndex && scopeDepth <= tokenDepth) {
      const separatedBranch = selector.slice(scopeIndex, tokenIndex).split("").some((character, offset) => (
        character === "," && depths[scopeIndex + offset] === scopeDepth
      ));
      if (!separatedBranch) return true;
    }
    if (scopeIndex > tokenIndex && scopeDepth <= tokenDepth) {
      const separatedCompound = selector.slice(tokenIndex, scopeIndex).split("").some((character, offset) => {
        const absolute = tokenIndex + offset;
        return depths[absolute] === tokenDepth && (character === "," || /\s/.test(character) || ">+~".includes(character));
      });
      if (!separatedCompound) return true;
    }
  }
  return false;
}

function selectorIsScoped(selector) {
  const depths = selectorDepths(selector);
  return selectorScopes(selector).some(({ index }) => (depths[index] ?? 0) === 0);
}

function bareSelectorFindings(source, maskedSelector, selectorStart, file) {
  const violations = [];
  let squareDepth = 0;

  for (let index = 0; index < maskedSelector.length; index += 1) {
    const character = maskedSelector[index];
    if (character === "[") {
      squareDepth += 1;
      continue;
    }
    if (character === "]") {
      squareDepth = Math.max(0, squareDepth - 1);
      continue;
    }
    if (squareDepth > 0) continue;

    let match = "";
    if (character === ":") {
      const pseudo = readCssIdentifier(maskedSelector, index + 1);
      if (pseudo.decoded.toLowerCase() === "root") match = maskedSelector.slice(index, pseudo.end);
    } else if (character === "*" && maskedSelector[index + 1] !== "=") {
      match = "*";
    } else if (/[A-Za-z_\\]/.test(character)) {
      const previous = maskedSelector[index - 1] ?? "";
      if (/[\w.#:-]/.test(previous)) continue;
      const identifier = readCssIdentifier(maskedSelector, index);
      if (bareElements.has(identifier.decoded.toLowerCase())) match = maskedSelector.slice(index, identifier.end);
      else {
        index = Math.max(index, identifier.end - 1);
        continue;
      }
    }

    if (!match) continue;
    if (!scopeApplies(maskedSelector, index)) {
      violations.push(finding(source, file, "global-selector", match, selectorStart + index));
    }
    index += match.length - 1;
  }
  return violations;
}

function selectorFindings(source, masked, file) {
  const violations = [];
  const stack = [];
  let statementStart = 0;

  for (let index = 0; index < masked.length; index += 1) {
    const character = masked[index];
    if (character === ";") {
      statementStart = index + 1;
      continue;
    }
    if (character === "}") {
      stack.pop();
      statementStart = index + 1;
      continue;
    }
    if (character !== "{") continue;

    const rawPrelude = masked.slice(statementStart, index);
    const prelude = rawPrelude.trim();
    const parent = stack.at(-1);
    const parentIsKeyframes = stack.some(({ keyframes }) => keyframes);
    const inheritedScope = parent?.scoped ?? false;
    const atRule = prelude.startsWith("@");
    const keyframes = atRule && /^@(?:-[\w]+-)?keyframes\b/i.test(prelude);

    let scoped = inheritedScope;
    if (prelude && !atRule && !parentIsKeyframes) {
      const parts = splitSelectorList(rawPrelude, statementStart);
      if (!inheritedScope) {
        for (const part of parts) violations.push(...bareSelectorFindings(source, part.source, part.start, file));
      }
      scoped = inheritedScope || parts.every((part) => selectorIsScoped(part.source));
    }

    stack.push({ keyframes: parentIsKeyframes || keyframes, scoped });
    statementStart = index + 1;
  }
  return violations;
}

function layerFindings(source, masked, file) {
  const normalizedFile = file.replaceAll("\\", "/");
  const violations = [];
  const layerStatements = Array.from(masked.matchAll(/@layer\s+([^;{]+)\s*;/gi));

  if (normalizedFile.endsWith("/next/styles.css") || normalizedFile === "styles.css") {
    if (layerStatements.length !== 1 || layerStatements[0][1].trim().replace(/\s*,\s*/g, ", ") !== exactLayerOrder) {
      const index = layerStatements[0]?.index ?? 0;
      violations.push(finding(source, file, "layer-order", source.slice(index, source.indexOf(";", index) + 1) || "missing layer order", index));
    }

    for (const match of masked.matchAll(/@import\b[^;]*;/gi)) {
      const layer = match[0].match(/\blayer\(\s*([\w-]+)\s*\)/i)?.[1];
      if (!layer || !layerOrder.includes(layer)) {
        violations.push(finding(source, file, "layer-order", source.slice(match.index, match.index + match[0].length), match.index));
      }
    }
  }

  for (const match of masked.matchAll(/@layer\s+([\w-]+)\s*\{/gi)) {
    if (!layerOrder.includes(match[1])) {
      violations.push(finding(source, file, "layer-order", match[0], match.index));
    }
  }
  return violations;
}

/**
 * Pure, position-preserving audit for a single Voreal Next CSS source.
 * @returns {{file:string,id:string,match:string,line:number,column:number}[]}
 */
export function findNextCssViolations(source, file = "<inline>") {
  const masked = maskNonCode(source);
  return [
    ...namespaceFindings(source, masked, file),
    ...importantFindings(source, masked, file),
    ...zIndexFindings(source, file),
    ...selectorFindings(source, masked, file),
    ...layerFindings(source, masked, file),
  ];
}

async function listCssFiles(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...await listCssFiles(entryPath));
    else if (entry.isFile() && entry.name.endsWith(".css")) files.push(entryPath);
  }
  return files.sort();
}

function importSpecifier(statement) {
  const remainder = statement.replace(/^@import\s*/i, "").trim();
  if (/^url\s*\(/i.test(remainder)) {
    const contents = remainder.slice(remainder.indexOf("(") + 1, remainder.indexOf(")")).trim();
    if ((contents.startsWith('"') && contents.endsWith('"')) || (contents.startsWith("'") && contents.endsWith("'"))) {
      return contents.slice(1, -1);
    }
    return contents.split(/\s/)[0];
  }
  if (remainder.startsWith('"') || remainder.startsWith("'")) {
    const quote = remainder[0];
    const end = remainder.indexOf(quote, 1);
    if (end > 0) return remainder.slice(1, end);
  }
  return undefined;
}

export function findCssImports(source) {
  const masked = maskNonCode(source);
  return Array.from(masked.matchAll(/@import\b[^;]*;/gi), (match) => {
    const statement = source.slice(match.index, match.index + match[0].length);
    const specifier = importSpecifier(statement);
    return specifier ? { index: match.index, specifier } : null;
  }).filter(Boolean);
}

/** Audits CSS files and verifies every file is included by the layered entry point. */
export async function auditNextCss(root = "src/next") {
  const absoluteRoot = await realpath(path.resolve(root));
  const files = await listCssFiles(absoluteRoot);
  const findings = [];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    findings.push(...findNextCssViolations(source, path.relative(process.cwd(), file)));
  }

  const entry = path.join(absoluteRoot, "styles.css");
  const entrySource = await readFile(entry, "utf8");
  const imported = new Set();
  for (const item of findCssImports(entrySource)) {
    const target = path.resolve(path.dirname(entry), item.specifier);
    try {
      const targetReal = await realpath(target);
      const relative = path.relative(absoluteRoot, targetReal);
      if (relative.startsWith("..") || path.isAbsolute(relative)) {
        findings.push(finding(entrySource, path.relative(process.cwd(), entry), "layer-order", item.specifier, item.index));
      } else imported.add(targetReal);
    } catch {
      findings.push(finding(entrySource, path.relative(process.cwd(), entry), "layer-order", item.specifier, item.index));
    }
  }

  for (const file of files) {
    const fileReal = await realpath(file);
    if (fileReal !== entry && !imported.has(fileReal)) {
      findings.push({
        file: path.relative(process.cwd(), file),
        id: "layer-order",
        match: "not imported by src/next/styles.css",
        line: 1,
        column: 1,
      });
    }
  }

  return { findings, scannedFiles: files.length };
}

async function main() {
  const root = process.argv[2] ?? "src/next";
  const { findings, scannedFiles } = await auditNextCss(root);
  console.log(`Voreal Next CSS audit · ${root}`);
  for (const violation of findings) {
    console.log(`${violation.file}:${violation.line}:${violation.column} [${violation.id}] ${violation.match}`);
  }
  console.log(`${findings.length} violation${findings.length === 1 ? "" : "s"} across ${scannedFiles} scanned CSS file${scannedFiles === 1 ? "" : "s"}.`);
  if (findings.length > 0) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}

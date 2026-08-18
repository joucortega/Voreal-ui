export type NativeControlComputedStyle = {
  color: string;
  display: string;
  opacity: string;
  visibility: string;
};

export type NativeControlAppearance = {
  box?: { height: number; width: number };
  hidden: boolean;
  style: NativeControlComputedStyle;
};

function parseUnitAlpha(value: string): number | undefined {
  const normalized = value.trim();
  const numeric = Number.parseFloat(normalized);
  if (!Number.isFinite(numeric)) return undefined;
  const alpha = normalized.endsWith("%") ? numeric / 100 : numeric;
  return Math.min(1, Math.max(0, alpha));
}

export function parseCssColorAlpha(color: string): number {
  const normalized = color.trim().toLowerCase();
  if (normalized === "transparent") return 0;

  const hex = normalized.match(/^#(?:[\da-f]{4}|[\da-f]{8})$/u);
  if (hex) {
    const alphaHex = normalized.length === 5
      ? `${normalized.at(-1)}${normalized.at(-1)}`
      : normalized.slice(-2);
    return Number.parseInt(alphaHex, 16) / 255;
  }

  const body = normalized.match(/^[a-z][\w-]*\((.*)\)$/u)?.[1];
  if (!body) return 1;

  const slashAlpha = body.match(/\/\s*([^\s,)]+)\s*$/u)?.[1];
  if (slashAlpha !== undefined) return parseUnitAlpha(slashAlpha) ?? 1;

  const commaParts = body.split(",");
  if (commaParts.length === 4) return parseUnitAlpha(commaParts[3] ?? "") ?? 1;
  return 1;
}

export function isNativeControlAppearanceVisible({ box, hidden, style }: NativeControlAppearance): boolean {
  if (hidden || style.display.trim().toLowerCase() === "none") return false;
  const visibility = style.visibility.trim().toLowerCase();
  if (visibility === "hidden" || visibility === "collapse") return false;
  if ((parseUnitAlpha(style.opacity) ?? 1) <= 0 || parseCssColorAlpha(style.color) <= 0) return false;
  if (box && (box.width <= 0 || box.height <= 0)) return false;
  return true;
}

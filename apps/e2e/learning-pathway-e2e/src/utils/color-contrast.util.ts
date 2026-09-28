function parseRgb(color: string): [number, number, number] {
  const match = /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/.exec(color);
  if (!match) {
    throw new Error(`Unable to parse colour: ${color}`);
  }
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const [rs, gs, bs] = [r, g, b].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function contrastRatio(colorA: string, colorB: string): number {
  const luminanceA = relativeLuminance(parseRgb(colorA));
  const luminanceB = relativeLuminance(parseRgb(colorB));
  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);
  return (lighter + 0.05) / (darker + 0.05);
}

export function extractShadowColor(boxShadow: string): string {
  const colors = boxShadow.match(/rgba?\([^)]+\)/g) ?? [];
  const visible = colors.filter((color) => {
    const alphaMatch = /rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\s*\)/.exec(color);
    return !alphaMatch || Number(alphaMatch[1]) > 0;
  });

  const lastVisible = visible.at(-1);
  if (!lastVisible) {
    throw new Error(`No visible colour found in box-shadow: ${boxShadow}`);
  }
  return lastVisible;
}

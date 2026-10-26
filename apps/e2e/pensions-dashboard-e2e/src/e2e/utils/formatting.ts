export class FormattingUtils {
  static normalizeText(text: string): string {
    return (text ?? '').replaceAll(/\s+/g, ' ').trim();
  }

  static normalizePennies(text: string): string {
    return (text ?? '')
      .replaceAll(
        /(\d{1,3}(?:,\d{3})*|\d+)(\.\d{1,2})?(?!\d)/g,
        (match: string) => {
          const numericValue = Number(match.replaceAll(',', ''));
          if (Number.isNaN(numericValue)) return match;
          return numericValue.toLocaleString('en-GB', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        },
      )
      .replaceAll(/\s+/g, ' ')
      .trim();
  }

  static formatDisplayAmount(amount: number | null): string {
    if (amount === null || amount === undefined) return '--';
    const n = Number(amount);
    const isInteger = Number.isInteger(n);
    return n.toLocaleString('en-GB', {
      minimumFractionDigits: isInteger ? 0 : 2,
      maximumFractionDigits: 2,
    });
  }

  // New: canonicalize text for comparisons (normalize quotes, remove commas, collapse whitespace, lowercase)
  static normalizeForComparison(input: string | undefined = ''): string {
    return input
      .replaceAll('\uFFFD', "'")
      .replaceAll(/[‘’‚‛`´]/g, "'")
      .replaceAll(/[“”„‟]/g, '"')
      .replaceAll(',', ' ')
      .replaceAll(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }
}

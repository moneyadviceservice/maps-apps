export class PensionTypeUtils {
  static getCaseType(type: string, hasIncome: boolean): string {
    if (type === 'SP') return 'statePension';
    if (['DC', 'DB', 'HYB', 'AVC'].includes(type)) {
      return `${type}${
        hasIncome ? 'WithEstimatedIncome' : 'WithoutEstimatedIncome'
      }`;
    }
    return 'UnknownPensionType';
  }

  static shouldShowFeatureAccordion(data: any): boolean {
    return data.illustrationWarnings && data.illustrationWarnings.length > 0;
  }

  static shouldShowMoreDetailsAccordion(data: any): boolean {
    return data.illustrationWarnings && data.illustrationWarnings.length > 0;
  }
}

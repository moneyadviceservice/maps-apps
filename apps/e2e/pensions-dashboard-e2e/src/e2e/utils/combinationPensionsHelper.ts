import { Page } from '@maps/playwright';

const PERMITTED_BENEFIT_TYPES: Record<string, string[]> = {
  DC: ['DC', 'AVC', 'None'],
  DB: ['DB', 'DBL', 'AVC', 'INCN', 'INCL', 'CSHN', 'CSHL', 'None'],
  AVC: ['AVC', 'None'],
  CB: ['CBL', 'CBS', 'AVC', 'None'],
  CDC: ['CDI', 'CDL', 'AVC', 'None'],
  HYB: [],
};

class CombinationPensionsHelper {
  constructor(private readonly page: Page) {}

  /**
   * Helper function to determine if a pension should be categorized as 'Combination' pension
   */
  isCombinationPension(pensionType: string, illustrations: string[]): boolean {
    const targetTypes = ['DC', 'DB', 'AVC', 'CB', 'CDC'];

    if (!targetTypes.includes(pensionType)) {
      return false;
    }

    const permitted = PERMITTED_BENEFIT_TYPES[pensionType] || [];

    return illustrations.some(
      (illustration) => !permitted.includes(illustration),
    );
  }

  /**
   * Helper to parse the raw title string, e.g.:
   * "Frank_Type(CDC)_Illustrations(DC,CBL)" -> { pensionType: "CDC", illustrations: ["DC", "CBL"] }
   */
  parsePensionTitle(titleText: string) {
    const typeRegex = /Frank_Type\(([^)]+)\)/;
    const illustrationsRegex = /_Illustrations\(([^)]+)\)/;

    const typeMatch = typeRegex.exec(titleText);
    const illustrationsMatch = illustrationsRegex.exec(titleText);

    const pensionType = typeMatch ? typeMatch[1].trim() : '';
    const illustrationsRaw = illustrationsMatch ? illustrationsMatch[1] : '';

    const illustrations = illustrationsRaw
      ? illustrationsRaw.split(',').map((item) => item.trim())
      : [];

    return { pensionType, illustrations };
  }
}

export default CombinationPensionsHelper;

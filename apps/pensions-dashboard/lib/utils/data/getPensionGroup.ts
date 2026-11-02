import { PensionGroup, PensionsCategory } from '../../constants';
import { PensionArrangement } from '../../types';

/**
 * Gets a PensionGroup based on hasIncome and pensionCategory
 * @param hasIncome
 * @param pensionCategory
 * @returns PensionGroup or undefined
 */

export const getPensionGroup = ({
  hasIncome,
  pensionCategory,
}: PensionArrangement) => {
  switch (pensionCategory) {
    case PensionsCategory.CONFIRMED:
      return hasIncome ? PensionGroup.GREEN : PensionGroup.GREEN_NO_INCOME;
    case PensionsCategory.PENDING:
      return PensionGroup.YELLOW;
    case PensionsCategory.CONTACT:
      return PensionGroup.RED;
    default:
      return undefined;
  }
};

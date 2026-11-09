import { PensionGroup, PensionsCategory } from '../../constants';
import { PensionArrangement } from '../../types';
import { getPensionGroup } from './getPensionGroup';

type MockArrangementParams = {
  hasIncome?: boolean;
  pensionCategory?: PensionsCategory;
};

const createMockArrangement = ({
  hasIncome = false,
  pensionCategory = PensionsCategory.CONFIRMED,
}: MockArrangementParams) =>
  ({
    hasIncome,
    pensionCategory,
  } as PensionArrangement);

describe('getPensionGroup', () => {
  it('should return GREEN when pension category is CONFIRMED and has income', () => {
    const arrangement = createMockArrangement({ hasIncome: true });

    const result = getPensionGroup(arrangement);

    expect(result).toBe(PensionGroup.GREEN);
  });

  it('should return GREEN_NO_INCOME when pension category is CONFIRMED and has no income', () => {
    const arrangement = createMockArrangement({ hasIncome: false });

    const result = getPensionGroup(arrangement);

    expect(result).toBe(PensionGroup.GREEN_NO_INCOME);
  });

  it('should return YELLOW when pension category is PENDING', () => {
    const arrangementWithIncome = createMockArrangement({
      hasIncome: true,
      pensionCategory: PensionsCategory.PENDING,
    });

    expect(getPensionGroup(arrangementWithIncome)).toBe(PensionGroup.YELLOW);
  });

  it('should return RED when pension category is CONTACT', () => {
    const arrangementWithIncome = createMockArrangement({
      hasIncome: true,
      pensionCategory: PensionsCategory.CONTACT,
    });

    expect(getPensionGroup(arrangementWithIncome)).toBe(PensionGroup.RED);
  });

  it('should return undefined for unknown pension category', () => {
    const arrangement = {
      hasIncome: true,
      pensionCategory: 'UNKNOWN_CATEGORY' as PensionsCategory,
    } as PensionArrangement;

    const result = getPensionGroup(arrangement);

    expect(result).toBeUndefined();
  });
});

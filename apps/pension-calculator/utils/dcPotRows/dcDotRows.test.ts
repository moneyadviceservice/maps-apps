import {
  emptyPot,
  type PotsOfMoneyData,
  type PotsOfMoneyErrors,
} from 'types/pensions';

import { addPot, errorsAfterRemovingPot, removePot } from './dcPotRows';

jest.mock('types/pensions', () => ({
  emptyPot: jest
    .fn()
    .mockReturnValue({ name: '', currentValue: '', taxFreeCash: '' }),
}));

jest.mock('utils/pensionFieldIds', () => ({
  potFieldId: (index: number, field: string) => `pension-pot-${index}-${field}`,
}));

describe('dcPotRows Utilities', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addPot', () => {
    test('appends a new empty pot to the pots list', () => {
      const initialData: PotsOfMoneyData = {
        pots: [{ name: 'Pot 1', currentValue: '100', taxFreeCash: '0' }],
      } as unknown as PotsOfMoneyData;

      const result = addPot(initialData);

      expect(result.pots).toHaveLength(2);
      expect(result.pots[1]).toEqual({
        name: '',
        currentValue: '',
        taxFreeCash: '',
      });
      expect(emptyPot).toHaveBeenCalledTimes(1);
    });
  });

  describe('removePot', () => {
    test.each([
      [
        'does not remove pot when only 1 pot exists',
        [{ name: 'Pot 1', currentValue: '100', taxFreeCash: '0' }],
        0,
        1,
        ['Pot 1'],
      ],
      [
        'removes pot at specified index when multiple pots exist',
        [
          { name: 'Pot 1', currentValue: '100', taxFreeCash: '0' },
          { name: 'Pot 2', currentValue: '200', taxFreeCash: '0' },
          { name: 'Pot 3', currentValue: '300', taxFreeCash: '0' },
        ],
        1,
        2,
        ['Pot 1', 'Pot 3'],
      ],
    ])('%s', (_, pots, removeIndex, expectedCount, expectedNames) => {
      const data: PotsOfMoneyData = { pots } as unknown as PotsOfMoneyData;
      const result = removePot(data, removeIndex);

      expect(result.pots).toHaveLength(expectedCount);
      expect(result.pots.map((p) => p.name)).toEqual(expectedNames);
    });
  });

  describe('errorsAfterRemovingPot', () => {
    test('removes errors for removed pot, shifts remaining pot errors, and preserves non-pot errors', () => {
      const initialErrors: PotsOfMoneyErrors = {
        'general-error-key': ['General error'],
        'pension-pot-0-name': ['Name error 0'],
        'pension-pot-1-currentValue': ['Value error 1'],
        'pension-pot-2-taxFreeCash': ['Tax error 2'],
      };

      const result = errorsAfterRemovingPot(initialErrors, 1);

      expect(result).toEqual({
        'general-error-key': ['General error'],
        'pension-pot-0-name': ['Name error 0'],
        'pension-pot-1-taxFreeCash': ['Tax error 2'],
      });
    });

    test.each([
      [
        'removes pot 0 and shifts pot 1 errors to index 0',
        0,
        {
          'pension-pot-0-name': ['Error 0'],
          'pension-pot-1-name': ['Error 1'],
        },
        {
          'pension-pot-0-name': ['Error 1'],
        },
      ],
      [
        'removes pot 1 and leaves pot 0 errors unchanged',
        1,
        {
          'pension-pot-0-name': ['Error 0'],
          'pension-pot-1-name': ['Error 1'],
        },
        {
          'pension-pot-0-name': ['Error 0'],
        },
      ],
    ])('%s', (_, removedIndex, inputErrors, expectedErrors) => {
      const result = errorsAfterRemovingPot(inputErrors, removedIndex);
      expect(result).toEqual(expectedErrors);
    });
  });
});

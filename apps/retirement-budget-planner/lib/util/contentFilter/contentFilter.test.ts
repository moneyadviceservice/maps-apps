import { DEFAULT_PREFIX } from 'lib/constants/constants';
import {
  defaultContentModelData,
  mockFieldNames,
  mockSubmittedData,
} from '../../mocks/mockRetirementIncome';

import {
  createContentFromCache,
  createNewFieldsDataGroup,
  generateMultipleItems,
  removeFieldDataGroup,
  saveDataToMemoryOnFocusOut,
  validateFormInputNames,
} from './contentFilter';
import { FREQUNCY_KEYS } from 'lib/constants/pageConstants';
import { RetirementFieldTypes } from 'lib/types/page.type';

jest.mock('lib/util/cacheToRedis', () => ({
  getDataFromMemory: jest
    .fn()
    .mockImplementationOnce(() => {
      return {
        'about-you': {
          name: ['Alex', 'John'],
        },
      };
    })
    .mockImplementation(() => ({})),
}));

globalThis.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  }),
);

const t = jest.fn();

describe('Content filter', () => {
  let mockItemsToAdd: RetirementFieldTypes[] = [];

  beforeEach(() => {
    mockItemsToAdd = defaultContentModelData;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Generate multiple items', () => {
    it('should generate multiple items', () => {
      const items = generateMultipleItems(
        [1, 2, 3],
        'benefitsPension',
        false,
        '',
        FREQUNCY_KEYS.MONTH,
      );
      expect(items.length).toBe(3);

      expect(items).toStrictEqual([
        {
          index: 1,
          inputLabelName: `${DEFAULT_PREFIX}benefitsPensionLabel1`,
          moneyInputName: `${DEFAULT_PREFIX}benefitsPension1`,
          frequencyName: `${DEFAULT_PREFIX}benefitsPensionFrequency1`,
          enableRemove: false,
          defaultFrequency: 'month',
        },
        {
          index: 2,
          inputLabelName: `${DEFAULT_PREFIX}benefitsPensionLabel2`,
          moneyInputName: `${DEFAULT_PREFIX}benefitsPension2`,
          frequencyName: `${DEFAULT_PREFIX}benefitsPensionFrequency2`,
          enableRemove: false,
          defaultFrequency: 'month',
        },
        {
          index: 3,
          inputLabelName: `${DEFAULT_PREFIX}benefitsPensionLabel3`,
          moneyInputName: `${DEFAULT_PREFIX}benefitsPension3`,
          frequencyName: `${DEFAULT_PREFIX}benefitsPensionFrequency3`,
          enableRemove: false,
          defaultFrequency: 'month',
        },
      ]);
    });

    it('should return dynamic field with label', () => {
      const items = generateMultipleItems(
        [1],
        'benefitsPension',
        true,
        'Benefit',
        FREQUNCY_KEYS.DAY,
      );

      expect(items.length).toBe(1);

      expect(items).toStrictEqual([
        {
          index: 1,
          moneyInputName: `${DEFAULT_PREFIX}benefitsPension1`,
          frequencyName: `${DEFAULT_PREFIX}benefitsPensionFrequency1`,
          labelText: 'Benefit',
          enableRemove: true,
          defaultFrequency: 'day',
        },
      ]);
    });

    it('should return empty array when items array is empty', () => {
      const items = generateMultipleItems([], 'benefit', false);
      expect(items.length).toBe(0);
    });
    it('should return empty array when field name is null', () => {
      const items = generateMultipleItems([1, 2], '', false);
      expect(items.length).toBe(0);
    });
  });

  describe('Create new fields data group', () => {
    it('should create new fields group item', () => {
      const fields = createNewFieldsDataGroup(
        mockItemsToAdd,
        'workplace',
        'benefitPension',
        true,
        1,
      );
      expect(fields).not.toBe(null);
      if (fields) {
        expect(fields[0].fields[1].items.length).toBe(2);
        expect(fields[0].fields[1].items[1]).toEqual({
          index: 2,
          defaultFrequency: 'month',
          moneyInputName: `${DEFAULT_PREFIX}benefitPension2`,
          frequencyName: `${DEFAULT_PREFIX}benefitPensionFrequency2`,
          enableRemove: true,
        });
      }
    });

    it('should fail to create fields group if section name is not defined', () => {
      const fields = createNewFieldsDataGroup(
        mockItemsToAdd,
        '',
        'benefit',
        false,
        0,
      );

      expect(fields).toBe(null);
    });

    it('should fail to create fields group if field name is not defined', () => {
      const fields = createNewFieldsDataGroup(
        mockItemsToAdd,
        'benefit',
        '',
        false,
        0,
      );

      expect(fields).toBe(null);
    });
    it('should fail to create fields group if fields are empty', () => {
      const fields = createNewFieldsDataGroup([], 'benefit', '', false, 0);

      expect(fields).toBe(null);
    });
  });

  describe('Create dynamic content', () => {
    it('should create the data schema with static and dynamic content', () => {
      const sections = createContentFromCache(mockItemsToAdd, {
        workplace: { benefitPension: [2, 3] },
      });

      expect(sections[0].fields[1].items.length).toBe(3);
      expect(sections[0].fields[1].items[1]).toStrictEqual({
        index: 2,
        labelText: 'Benefit 1',
        moneyInputName: `${DEFAULT_PREFIX}benefitPension2`,
        frequencyName: `${DEFAULT_PREFIX}benefitPensionFrequency2`,
        enableRemove: true,
        defaultFrequency: 'month',
      });

      expect(sections[0].fields[1].items[2]).toStrictEqual({
        index: 3,
        labelText: 'Benefit 1',
        moneyInputName: `${DEFAULT_PREFIX}benefitPension3`,
        frequencyName: `${DEFAULT_PREFIX}benefitPensionFrequency3`,
        enableRemove: true,
        defaultFrequency: 'month',
      });
    });

    it('should fail to add fields if there is at least one with same index', () => {
      const mockData = mockFieldNames([
        {
          field: 'benefitPension',
          isDynamic: true,
          items: [
            { name: 'benefitPension', label: 'Benefit 1' },
            { name: 'benefitPension1', label: 'Benefit 2' },
          ],
        },
      ]);
      const s = createContentFromCache(mockData, {
        workplace: { benefitsPension: [1, 3] },
      });
      expect(s[0].fields[0].items.length).toBe(2);
    });

    it('should return initital content if no additional content exist', () => {
      const section = createContentFromCache(mockItemsToAdd, {});

      expect(section[0].fields[0].items.length).toBe(1);
      expect(section[0].fields[1].items.length).toBe(1);
    });
  });

  describe('Save to memory on focus out', () => {
    it('should call api to save data in Redis on focus out', () => {
      const event = {
        target: { name: 'netIncome' },
        preventDefault: jest.fn(),
      } as unknown as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;
      saveDataToMemoryOnFocusOut(
        event,
        'netIncome',
        'income',
        'TEST-SESSION-ID',
      );

      expect(globalThis.fetch).toHaveBeenCalled();
    });
  });

  describe('Validate form input names ', () => {
    it('should validate form input names and find income/essential related input names', () => {
      const isvalid = validateFormInputNames(mockSubmittedData);
      expect(isvalid).toBeTruthy();
    });
    it('should validate form input names and return false', () => {
      const isvalid = validateFormInputNames({
        test1: '',
        test2: '',
      });
      expect(isvalid).toBeFalsy();
    });
  });

  describe('Remove field group', () => {
    it('should return field group object when section name is empty', () => {
      const sections = removeFieldDataGroup(
        mockItemsToAdd,
        '',
        'benefitPension',
        1,
      );

      expect(sections[0].fields[1].items.length).toBe(1);
    });

    it('should return field group object when field name is empty', () => {
      const sections = removeFieldDataGroup(mockItemsToAdd, 'workplace', '', 1);

      expect(sections[0].fields[1].items.length).toBe(1);
    });
    it('should remove field group dynamically', () => {
      const sections = removeFieldDataGroup(
        mockFieldNames([
          {
            field: 'benefitPension',
            isDynamic: true,
            items: [
              { name: 'benefitPension', label: 'Benefit 1' },
              { name: 'benefitPension1', label: 'Benefit 2' },
            ],
          },
        ]),
        'workplace',
        'benefitPension',
        1,
      );

      expect(sections[0].fields[0].items.length).toBe(1);
      expect(sections[0].fields[0].items).toStrictEqual([
        {
          index: 0,
          defaultFrequency: 'month',
          enableRemove: true,
          labelText: 'Benefit 1',
          moneyInputName: 'benefitPension',
          frequencyName: 'benefitPensionFrequency',
        },
      ]);
    });
  });
});

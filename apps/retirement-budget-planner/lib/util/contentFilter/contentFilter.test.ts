import {
  mockContent,
  mockFieldNames,
  mockSubmittedData,
} from '../../mocks/mockRetirementIncome';

import {
  concatStaticDynamicFields,
  createDynamicContent,
  createNewMoneyInputFrequencyItem,
  generateMultipleItems,
  generateNewId,
  getGroupFieldConfigs,
  getPageContent,
  removeMoneyInputFrequencyItem,
  saveDataToMemoryOnFocusOut,
  validateFormInputNames,
} from './contentFilter';

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

const mockFieldNamesCallBack = jest.fn().mockImplementation(() => {
  return mockFieldNames(['yourIncome', 'statePension'], 'p');
});

const mockContentCallBack = jest.fn().mockImplementation(() => {
  return mockContent;
});
describe('Content filter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should generate multiple items', () => {
    const items = generateMultipleItems([1, 2, 3], 'benefitsPension');
    expect(items.length).toBe(3);

    expect(items).toStrictEqual([
      {
        index: 1,
        inputLabelName: 'benefitsPensionLabel1',
        moneyInputName: 'benefitsPension1',
        frequencyName: 'benefitsPensionFrequency1',
      },
      {
        index: 2,
        inputLabelName: 'benefitsPensionLabel2',
        moneyInputName: 'benefitsPension2',
        frequencyName: 'benefitsPensionFrequency2',
      },
      {
        index: 3,
        inputLabelName: 'benefitsPensionLabel3',
        moneyInputName: 'benefitsPension3',
        frequencyName: 'benefitsPensionFrequency3',
      },
    ]);
  });

  it('should return empty array when items array is empty', () => {
    const items = generateMultipleItems([], 'benefit');
    expect(items.length).toBe(0);
  });
  it('should return empty array when section name is null', () => {
    const items = generateMultipleItems([1, 2], '');
    expect(items.length).toBe(0);
  });

  it('should create new fields group item', () => {
    const fields = createNewMoneyInputFrequencyItem(
      mockFieldNames(['statePension', 'benefitsPension']),
      'benefitsPension',
    );
    expect(fields).not.toBe(null);
    if (fields) {
      expect(fields[1].items.length).toBe(3);
      expect(fields[1].items[2]).toStrictEqual({
        index: 2,
        inputLabelName: 'benefitsPensionLabel2',
        moneyInputName: 'benefitsPension2',
        frequencyName: 'benefitsPensionFrequency2',
      });
    }
  });

  it('should fail to create fields group if section name is not defined', () => {
    const fields = createNewMoneyInputFrequencyItem(
      mockFieldNames(['statePension', 'benefitsPension']),
      '',
    );

    expect(fields).toBe(null);
  });

  it('should fail to create fields group if fields are empty', () => {
    const fields = createNewMoneyInputFrequencyItem([], 'benefit');

    expect(fields).toBe(null);
  });

  it('should remove field group dynamically', () => {
    const fields = removeMoneyInputFrequencyItem(
      mockFieldNames(['statePension', 'benefitsPension']),
      'benefitsPension',
      1,
    );

    expect(fields[1].items.length).toBe(1);
    expect(fields[1].items).toStrictEqual([
      {
        index: 0,
        inputLabelName: 'benefitsPensionLabel',
        moneyInputName: 'benefitsPension',
        frequencyName: 'benefitsPensionFrequency',
      },
    ]);
  });

  it('should create content dynamically', () => {
    const fields = createDynamicContent(
      mockFieldNames(['statePension', 'benefitsPension']),
      { benefitsPension: [2, 3] },
    );

    expect(fields[1].items.length).toBe(4);
    expect(fields[1].items[2]).toStrictEqual({
      index: 2,
      inputLabelName: 'benefitsPensionLabel2',
      moneyInputName: 'benefitsPension2',
      frequencyName: 'benefitsPensionFrequency2',
    });

    expect(fields[1].items[3]).toStrictEqual({
      index: 3,
      inputLabelName: 'benefitsPensionLabel3',
      moneyInputName: 'benefitsPension3',
      frequencyName: 'benefitsPensionFrequency3',
    });
  });

  it('should fail to add fields if there is at least one with same index', () => {
    const fields = createDynamicContent(
      mockFieldNames(['statePension', 'benefitsPension']),
      { benefitsPension: [1, 3] },
    );
    expect(fields[1].items.length).toBe(2);
  });

  it('should return initital content if no additional content exist', () => {
    const fields = createDynamicContent(
      mockFieldNames(['statePension', 'benefitsPension']),
      {},
    );

    expect(fields[0].items.length).toBe(1);
    expect(fields[1].items.length).toBe(2);
  });

  it('should generate new id', () => {
    const id = generateNewId(
      { benefitsPension: [2, 3] },
      mockFieldNames(['statePension', 'benefitsPension']),
      'benefitsPension',
    );

    expect(id).toBe(4);
  });

  it('should generate the new id 6', () => {
    const id = generateNewId(
      { benefitsPension: [2, 5] },
      mockFieldNames(['statePension', 'benefitsPension']),
      'benefitsPension',
    );

    expect(id).toBe(6);
  });
  it('should generate the new id when none cached', () => {
    const id = generateNewId(
      {},
      mockFieldNames(['statePension', 'benefitsPension']),
      'benefitsPension',
    );

    expect(id).toBe(2);
  });

  it('should concat static and dynamic fields data', () => {
    const partners = ['Partner 1', 'Partner 2'];
    const fields = mockFieldNames(['benefits1', 'benefits2']);

    const results = concatStaticDynamicFields(
      mockFieldNamesCallBack,
      t,
      partners,
      fields,
    );

    expect(results.length).toBe(6);
    expect(results[0]?.sectionName).toBe('yourIncome');
    expect(results[5].sectionName).toBe('benefits2');
  });

  it('should return dynamic data only if static array is empty', () => {
    const p = ['Partner 1', 'Partner 2'];
    const fields = mockFieldNames(['benefits1', 'benefits2']);
    const results = concatStaticDynamicFields(
      jest.fn().mockImplementation(() => []),
      t,
      p,
      fields,
    );

    expect(results.length).toBe(2);
  });

  it('should return static field data only if dynamic array is empty', () => {
    const p = ['Partner 1', 'Partner 2'];

    const results = concatStaticDynamicFields(mockFieldNamesCallBack, t, p, []);

    expect(results.length).toBe(4);
  });

  it('should generate page content for both partners', () => {
    const p = ['Partner 1', 'Partner 2'];

    const results = getPageContent(mockContentCallBack, t, p);

    expect(results.length).toBe(2);
    expect(results[0].partnerName).toBe('Partner 1');
  });

  it('should return one set of data if partner is not defined', () => {
    const results = getPageContent(mockContentCallBack, t, []);

    expect(results.length).toBe(1);
    expect(results[0].partnerName).toBe('Partner 1');
  });

  it('should return group field configs', () => {
    const p = ['Partner 1', 'Partner 2'];

    const results = getGroupFieldConfigs(mockFieldNamesCallBack, p);

    expect(results.length).toBe(4);
    expect(results[0].items[0].moneyInputName).toBe('p1yourIncome');
  });

  it('should call api to save data in Redis on focus out', () => {
    const event = {
      target: { name: 'netIncome' },
      preventDefault: jest.fn(),
    } as unknown as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;
    saveDataToMemoryOnFocusOut(event, 'netIncome', 'income', 'TEST-SESSION-ID');

    expect(globalThis.fetch).toHaveBeenCalled();
  });

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

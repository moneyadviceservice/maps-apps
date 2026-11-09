import { mockSubmittedData } from 'lib/mocks/mockRetirementIncome';
import {
  getDataFromMemory,
  saveDataToMemory,
  removeDataFromMemory,
  hasDataProperty,
  setDataToRedis,
} from './';

import {
  redisRestGetHash,
  redisRestSetHash,
} from '@maps-react/redis/rest-client';

jest.mock('@maps-react/redis/rest-client', () => ({
  redisRestGetHash: jest.fn().mockResolvedValue({}),
  redisRestSetHash: jest.fn().mockResolvedValue({}),
}));

const mockSessionId = 'abcdefghijklmnopqrstuvwxyz012345';
const mockSite = 'RBP';
const mockGetHash = jest.mocked(redisRestGetHash);
const mockSetHash = jest.mocked(redisRestSetHash);

// Simulate that cache.get returns some value to indicate data already exists
const mockGetFromMemory = (data?: typeof mockSubmittedData) => {
  const pageData = data ? { pageData: data } : null;
  const addedData = {
    ...pageData,
    additionalFields: {
      workplacePension: { definedContribution: [1, 2] },
    },
  };

  mockGetHash.mockResolvedValue({
    success: true,
    data: {
      key: `income:${mockSessionId}`,
      value: {
        pageData: JSON.stringify(addedData.pageData),
        additionalFields: JSON.stringify(addedData.additionalFields),
      },
      site: mockSite,
    },
  });
};

describe('Income / Essential cache server side functions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockGetHash.mockResolvedValue({
      success: true,
      data: {
        key: `income:${mockSessionId}`,
        value: {},
        site: mockSite,
      },
    });
    mockSetHash.mockResolvedValue({
      success: true,
      data: {
        success: true,
        setCount: 2,
        site: mockSite,
      },
    });
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('hasDataProperty helper', () => {
    it('should return false when a required value is missing', () => {
      expect(hasDataProperty('', 'formbenefitPension', '1')).toBe(false);
      expect(hasDataProperty('formbenefitPension1', undefined, '1')).toBe(
        false,
      );
      expect(
        hasDataProperty('formbenefitPension1', 'formbenefitPension', undefined),
      ).toBe(false);
    });
  });

  describe('Get data from memory', () => {
    it('should parse data from a successful REST response', async () => {
      mockGetFromMemory(mockSubmittedData);

      await expect(getDataFromMemory(mockSessionId, 'income')).resolves.toEqual(
        {
          pageData: mockSubmittedData,
          additionalFields: {
            workplacePension: { definedContribution: [1, 2] },
          },
        },
      );
      expect(mockGetHash).toHaveBeenCalledWith(`income:${mockSessionId}`);
    });

    it('should return empty fields for an empty hash', async () => {
      await expect(getDataFromMemory(mockSessionId, 'income')).resolves.toEqual(
        {
          pageData: {},
          additionalFields: [],
        },
      );
    });

    it('should return null when the response has no data', async () => {
      mockGetHash.mockResolvedValue({ success: true });

      await expect(
        getDataFromMemory(mockSessionId, 'income'),
      ).resolves.toBeNull();
    });

    it.each`
      error                  | message
      ${'Redis unavailable'} | ${'Redis unavailable'}
      ${undefined}           | ${'Unknown error'}
    `(
      'should log the error and return null for an unsuccessful response: $error',
      async ({ error, message }) => {
        mockGetHash.mockResolvedValue({ success: false, error });

        await expect(
          getDataFromMemory(mockSessionId, 'income'),
        ).resolves.toBeNull();
        expect(console.error).toHaveBeenCalledWith(
          'Failed to retrieve data from memory or data don`t exist',
          new Error(message),
        );
      },
    );
  });

  describe('Save data to memory', () => {
    it('should not resolve until the data has been written', async () => {
      mockGetHash.mockResolvedValue({ success: true });
      let resolveWrite: () => void = () => undefined;
      mockSetHash.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveWrite = () => resolve({ success: true });
          }),
      );

      let saved = false;
      const savePromise = saveDataToMemory(
        mockSessionId,
        mockSubmittedData,
        'income',
        'stateSection',
      ).then(() => {
        saved = true;
      });

      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(mockSetHash).toHaveBeenCalled();
      expect(saved).toBe(false);

      resolveWrite();
      await savePromise;
      expect(saved).toBe(true);
    });

    it('should save data without additional fields when memory has no data', async () => {
      mockGetHash.mockResolvedValue({ success: true });

      await saveDataToMemory(
        mockSessionId,
        { ...mockSubmittedData, language: 'en' },
        'income',
        'stateSection',
      );

      expect(mockSetHash).toHaveBeenCalledWith(`income:${mockSessionId}`, {
        pageData: JSON.stringify(mockSubmittedData),
        additionalFields: '',
      });
    });

    it('should save data to memory for the first time', async () => {
      await saveDataToMemory(
        mockSessionId,
        { ...mockSubmittedData, language: 'en' },
        'income',
        'stateSection',
        'statePension',
        1,
      );

      expect(mockGetHash).toHaveBeenCalledTimes(1);
      expect(mockGetHash).toHaveBeenCalledWith(`income:${mockSessionId}`);
      expect(mockSetHash).toHaveBeenCalledTimes(1);
      expect(mockSetHash).toHaveBeenCalledWith(`income:${mockSessionId}`, {
        pageData: JSON.stringify(mockSubmittedData),
        additionalFields: JSON.stringify({
          stateSection: { statePension: [1] },
        }),
      });
    });

    it('should save data to memory when it already exists', async () => {
      mockGetFromMemory(mockSubmittedData);
      await saveDataToMemory(
        mockSessionId,
        { ...mockSubmittedData, language: 'en' },
        'income',
        'stateSection',
        'statePension',
        1,
      );

      expect(mockSetHash).toHaveBeenCalledWith(`income:${mockSessionId}`, {
        pageData: JSON.stringify(mockSubmittedData),
        additionalFields: JSON.stringify({
          workplacePension: { definedContribution: [1, 2] },
          stateSection: { statePension: [1] },
        }),
      });
    });

    it('should preserve additional fields when no new field is added', async () => {
      mockGetFromMemory(mockSubmittedData);

      await saveDataToMemory(
        mockSessionId,
        { ...mockSubmittedData, language: 'en' },
        'income',
        'stateSection',
      );

      expect(mockSetHash).toHaveBeenCalledWith(`income:${mockSessionId}`, {
        pageData: JSON.stringify(mockSubmittedData),
        additionalFields: JSON.stringify({
          workplacePension: { definedContribution: [1, 2] },
        }),
      });
    });

    it('should save data to memory when page data is empty', async () => {
      mockGetFromMemory();
      await saveDataToMemory(
        mockSessionId,
        { ...mockSubmittedData, language: 'en' },
        'income',
        'stateSection',
        'statePension',
        1,
      );

      expect(mockSetHash).toHaveBeenCalledWith(`income:${mockSessionId}`, {
        pageData: JSON.stringify(mockSubmittedData),
        additionalFields: JSON.stringify({
          workplacePension: { definedContribution: [1, 2] },
          stateSection: { statePension: [1] },
        }),
      });
    });

    it('should save data to memory when page data is null', async () => {
      mockGetHash.mockResolvedValue({
        success: true,
        data: {
          key: `income:${mockSessionId}`,
          value: {
            pageData: JSON.stringify(null),
            additionalFields: JSON.stringify(null),
          },
          site: mockSite,
        },
      });

      await saveDataToMemory(
        mockSessionId,
        { ...mockSubmittedData, language: 'en' },
        'income',
        'stateSection',
        'statePension',
        1,
      );

      expect(mockSetHash).toHaveBeenCalledWith(`income:${mockSessionId}`, {
        pageData: JSON.stringify(mockSubmittedData),
        additionalFields: JSON.stringify(null),
      });
    });

    it('should save new data to redis even if call to get data fails', async () => {
      const mockGetError = new Error('Redis unavailable');
      mockGetHash.mockRejectedValue(mockGetError);

      await saveDataToMemory(
        mockSessionId,
        { ...mockSubmittedData, language: 'en' },
        'income',
        'stateSection',
        'statePension',
        1,
      );

      expect(mockSetHash).toHaveBeenCalledWith(`income:${mockSessionId}`, {
        pageData: JSON.stringify(mockSubmittedData),
        additionalFields: JSON.stringify({
          stateSection: { statePension: [1] },
        }),
      });
      expect(console.error).toHaveBeenCalledWith(
        'Failed to retrieve data from memory or data don`t exist',
        mockGetError,
      );
    });
  });

  describe('setDataToRedis helper', () => {
    it('should not save null data', async () => {
      await setDataToRedis(null, 'income', mockSessionId);

      expect(mockSetHash).not.toHaveBeenCalled();
    });
  });

  describe('Remove data from memory', () => {
    it('should remove data from memory', async () => {
      mockGetFromMemory(mockSubmittedData);
      await removeDataFromMemory(
        mockSessionId,
        { ...mockSubmittedData, language: 'en' },
        'income',
        1,
        'workplacePension',
        'benefitPension',
      );

      expect(mockSetHash).toHaveBeenCalledWith(`income:${mockSessionId}`, {
        pageData: JSON.stringify({
          ...mockSubmittedData,
          formbenefitPension1: undefined,
          formbenefitPensionLabel1: undefined,
        }),
        additionalFields: JSON.stringify({
          workplacePension: { definedContribution: [1, 2] },
        }),
      });
    });

    it('should remove specified ID from additional fields', async () => {
      mockGetFromMemory(mockSubmittedData);
      await removeDataFromMemory(
        mockSessionId,
        { ...mockSubmittedData, language: 'en' },
        'income',
        2,
        'workplacePension',
        'definedContribution',
      );

      expect(mockSetHash).toHaveBeenCalledWith(`income:${mockSessionId}`, {
        pageData: JSON.stringify(mockSubmittedData),
        additionalFields: JSON.stringify({
          workplacePension: { definedContribution: [1] },
        }),
      });
    });

    it('should return error when removing data from memory fails', async () => {
      mockGetFromMemory(mockSubmittedData);

      const mockSetError = new Error('Redis unavailable');
      mockSetHash.mockRejectedValue(mockSetError);

      await removeDataFromMemory(
        mockSessionId,
        { ...mockSubmittedData, language: 'en' },
        'income',
        1,
        'workplacePension',
        'definedBenefit',
      );

      expect(console.error).toHaveBeenCalledWith(
        'Failed to save the updated data after removing a field set',
        mockSetError,
      );
    });
  });
});

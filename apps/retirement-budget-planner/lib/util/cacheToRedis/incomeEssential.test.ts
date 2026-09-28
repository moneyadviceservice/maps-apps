import { mockSubmittedData } from 'lib/mocks/mockRetirementIncome';
import { removeDataFromMemory, saveDataToMemory } from './';

jest.mock('@maps-react/redis/helpers', () => ({
  redisSetHash: jest.fn().mockResolvedValue({}),
  redisGetHash: jest.fn().mockResolvedValue({}),
}));

import * as Cache from '@maps-react/redis/helpers';

const SESSIONID = 'sfds90789dfvccvfbg';

// Simulate that cache.get returns some value to indicate data already exists
const mockGetFromMemory = (data?: typeof mockSubmittedData) => {
  const pageData = data ? { pageData: data } : null;
  const addedData = {
    ...pageData,
    additionalFields: {
      workplacePension: { definedContribution: [1] },
    },
  };

  (Cache.redisGetHash as jest.Mock).mockResolvedValue({
    pageData: JSON.stringify(addedData.pageData),
    additionalFields: JSON.stringify(addedData.additionalFields),
  });
};

describe('Income / Essential cache server side functions', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Save data to memrory', () => {
    it('should save data to memory for the first time', async () => {
      const spyPut = jest.spyOn(Cache, 'redisSetHash');

      await saveDataToMemory(
        SESSIONID,
        { ...mockSubmittedData, language: 'en' },
        'income',
        'stateSection',
        'statePension',
        1,
      );
      expect(spyPut).toHaveBeenCalledTimes(1);
      spyPut.mockRestore();
    });

    it('should save data to memory when already exist', async () => {
      mockGetFromMemory(mockSubmittedData);
      const spyPut = jest.spyOn(Cache, 'redisSetHash');

      await saveDataToMemory(
        SESSIONID,
        { ...mockSubmittedData, language: 'en' },
        'income',
        'stateSection',
        'statePension',
        1,
      );
      expect(spyPut).toHaveBeenCalled();
      spyPut.mockRestore();
    });

    it('should save data to memory when page data are empty', async () => {
      (Cache.redisGetHash as jest.Mock).mockResolvedValue({
        pageData: { pageData: {} },
      });
      const spyPut = jest.spyOn(Cache, 'redisSetHash');

      await saveDataToMemory(
        SESSIONID,
        { ...mockSubmittedData, language: 'en' },
        'income',
        'stateSection',
        'statePension',
        1,
      );
      expect(spyPut).toHaveBeenCalled();
      spyPut.mockRestore();
    });

    it('should save new data to redis even call to get data fails', async () => {
      (Cache.redisGetHash as jest.Mock).mockRejectedValue({});
      const spyPut = jest
        .spyOn(Cache, 'redisSetHash')
        .mockImplementation(() => Promise.resolve(9));
      await saveDataToMemory(
        SESSIONID,
        { ...mockSubmittedData, language: 'en' },
        'income',
        'stateSection',
        'statePension',
        1,
      );

      expect(spyPut).toHaveBeenCalled();
      spyPut.mockRestore();
    });
  });

  describe('Remove data from memory', () => {
    it('should remove data from memory', async () => {
      mockGetFromMemory(mockSubmittedData);
      const spyPut = jest.spyOn(Cache, 'redisSetHash');
      await removeDataFromMemory(
        SESSIONID,
        { ...mockSubmittedData, language: 'en' },
        'income',
        1,
        'workplacePension',
        'benefitPension',
      );

      expect(spyPut).toHaveBeenCalled();
      spyPut.mockRestore();
    });

    it('should return error when removing data from memory fails', async () => {
      mockGetFromMemory(mockSubmittedData);
      (Cache.redisSetHash as jest.Mock).mockRejectedValue('Error: ....');
      const error = jest.spyOn(console, 'error');
      await removeDataFromMemory(
        SESSIONID,
        { ...mockSubmittedData, language: 'en' },
        'income',
        1,
        'workplacePension',
        'definedBenefit',
      );
      expect(error).toHaveBeenCalled();
      error.mockRestore();
    });
  });
});

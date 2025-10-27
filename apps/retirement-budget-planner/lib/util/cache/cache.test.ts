import { removeDataFromMemory, saveDataToMemory } from './cache';
import { mockSubmittedData } from '../../mocks/mockRetirementIncome';
import * as cache from 'memory-cache';

jest.mock('memory-cache', () => ({
  get: jest.fn(),
  put: jest.fn(),
}));

// Simulate that cache.get returns some value to indicate data already exists
const mockGetFromMemory = (data?: typeof mockSubmittedData) => {
  (cache.get as jest.Mock).mockReturnValue({
    retirement: {
      ...(data && { pageData: data }),
      additionalFields: {
        benefitPension: [1],
      },
    },
  });
};

describe('Cache ', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should save data to memory for the first time', () => {
    const spyPut = jest.spyOn(cache, 'put');

    saveDataToMemory(
      { ...mockSubmittedData, language: 'en' },
      'retirement',
      'statePension',
      1,
    );
    expect(spyPut).toHaveBeenCalled();
    spyPut.mockRestore();
  });

  it('should save data to memory when already exist', () => {
    mockGetFromMemory(mockSubmittedData);
    const spyPut = jest.spyOn(cache, 'put');

    saveDataToMemory(
      { ...mockSubmittedData, language: 'en' },
      'retirement',
      'statePension',
      1,
    );
    expect(spyPut).toHaveBeenCalled();
    spyPut.mockRestore();
  });

  it('should save data to memory when page data are empty', () => {
    mockGetFromMemory();
    const spyPut = jest.spyOn(cache, 'put');

    saveDataToMemory(
      { ...mockSubmittedData, language: 'en' },
      'retirement',
      'statePension',
      1,
    );
    expect(spyPut).toHaveBeenCalled();
    spyPut.mockRestore();
  });

  it('should remove data from memory', () => {
    mockGetFromMemory(mockSubmittedData);
    const spyPut = jest.spyOn(cache, 'put');
    removeDataFromMemory(
      { ...mockSubmittedData, language: 'en' },
      'retirement',
      1,
      'benefitPension',
    );

    expect(spyPut).toHaveBeenCalled();
    spyPut.mockRestore();
  });
});

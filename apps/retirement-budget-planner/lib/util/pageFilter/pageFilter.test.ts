import {
  getInitialTabCount,
  getInitialTabData,
  getTabNameFromParams,
} from './pageFilter';
import { mockTabs } from 'lib/mocks/mockTabs';

describe('Test getTabNameFromParams', () => {
  it('should return (about-you) page', () => {
    const tabName = getTabNameFromParams('/en/about-you');
    expect(tabName).toBe('about-you');
  });

  it('should return summary page', () => {
    const tabName = getTabNameFromParams('/en/summary');
    expect(tabName).toBe('summary');
  });

  it('should throw an error when url is empty', () => {
    expect(() => getTabNameFromParams(undefined)).toThrow(
      'Query url is missing',
    );
  });

  it('should return the initial tab count to be same as the highest step accessed', () => {
    const tabCount = getInitialTabCount(mockTabs, '3', 'about-you');
    expect(tabCount).toBe(3);
  });

  it('should return the initial tab count to be same as current tab', () => {
    const tabCount = getInitialTabCount(mockTabs, undefined, 'about-you');
    expect(tabCount).toBe(1);
  });

  it('should get initial tab data', () => {
    const { initialActiveTabId } = getInitialTabData(mockTabs, 'retirement');
    expect(initialActiveTabId).toBe('retirement');
  });

  it('should get first tab data if tabname is not matching', () => {
    const { initialActiveTabId } = getInitialTabData(mockTabs, '');
    expect(initialActiveTabId).toBe('about-you');
  });
});

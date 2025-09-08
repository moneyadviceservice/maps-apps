import {
  getInitialTabCount,
  getInitialTabData,
  getPageTitle,
  getTabNameFromParams,
} from './pageFilter';
import { mockTabs } from 'lib/mocks/mockTabs';

describe('Test getTabNameFromParams', () => {
  it('should return tab name for dynamic page', () => {
    const tabName = getTabNameFromParams('/en/retirement', {
      tabName: 'retirement',
    });
    expect(tabName).toBe('retirement');
  });

  it('should return empty string if tab name is not found', () => {
    const tabName = getTabNameFromParams('/en/some-page', {});
    expect(tabName).toBe('');
  });

  it('should return (about-us) tabName for non dynamic page', () => {
    const tabName = getTabNameFromParams('/en/about-you', {
      language: 'en',
    });
    expect(tabName).toBe('about-you');
  });

  it('should return summary tabName for non dynamic page', () => {
    const tabName = getTabNameFromParams('/en/summary', {
      language: 'en',
    });
    expect(tabName).toBe('summary');
  });

  it('should throw an error when url is empty', () => {
    expect(() =>
      getTabNameFromParams(undefined, {
        language: 'en',
      }),
    ).toThrow('Query url is missing');
  });

  it('should return page title', () => {
    const title = getPageTitle(mockTabs, 'about-you');
    expect(title).toBe('About you');
  });

  it('should return an empty string as page title', () => {
    const title = getPageTitle(mockTabs, 'other-tab');
    expect(title).toBe('');
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
    const { initialActiveTabId, initialEnabledTabCount } = getInitialTabData(
      mockTabs,
      'retirement',
      undefined,
    );
    expect(initialActiveTabId).toBe('retirement');
    expect(initialEnabledTabCount).toBe(2);
  });

  it('should get first tab data if tabname is not matching', () => {
    const { initialActiveTabId, initialEnabledTabCount } = getInitialTabData(
      mockTabs,
      '',
      undefined,
    );
    expect(initialActiveTabId).toBe('about-you');
    expect(initialEnabledTabCount).toBe(1);
  });
});

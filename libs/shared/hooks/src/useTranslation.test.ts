import { renderHook } from '@testing-library/react';

import useLanguage from './useLanguage';
import useTranslation from './useTranslation';

// 1. Mock the useLanguage hook
jest.mock('./useLanguage', () => jest.fn());

// 2. Mock the dynamic JSON file imports using virtual mocks
jest.mock(
  '@maps-public/locales/en.json',
  () => ({
    helloWorld: 'Hello World',
    greeting: 'Hello {name}',
    section: {
      items: ['item1', 'item2', 'item3'],
    },
  }),
  { virtual: true },
);

jest.mock(
  '@maps-public/locales/cy.json',
  () => ({
    helloWorld: 'Helo Byd',
  }),
  { virtual: true },
);

jest.mock(
  '@maps-public/locales/subfolder/en.json',
  () => ({
    subText: 'Subfolder Hello',
  }),
  { virtual: true },
);

describe('useTranslation hook', () => {
  let consoleWarnMock: jest.SpyInstance;

  beforeEach(() => {
    // Default mock implementation to English
    (useLanguage as jest.Mock).mockReturnValue('en');

    // Suppress console.warn to keep test output clean, but allow us to spy on it
    consoleWarnMock = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleWarnMock.mockRestore();
  });

  describe('Initialization', () => {
    it('throws an error if an unsupported locale is used', () => {
      (useLanguage as jest.Mock).mockReturnValue('fr');
      expect(() => renderHook(() => useTranslation())).toThrow(
        'locale [fr] does not exist',
      );
    });

    it('allows overriding the locale via parameters', () => {
      const { result } = renderHook(() => useTranslation('cy'));
      expect(result.current.locale).toBe('cy');
    });
  });

  describe('z() inline translation', () => {
    it('returns the English translation by default', () => {
      const { result } = renderHook(() => useTranslation());
      const text = result.current.z({ en: 'Hello', cy: 'Helo' });
      expect(text).toBe('Hello');
    });

    it('returns the Welsh translation when locale is cy', () => {
      (useLanguage as jest.Mock).mockReturnValue('cy');
      const { result } = renderHook(() => useTranslation());
      const text = result.current.z({ en: 'Hello', cy: 'Helo' });
      expect(text).toBe('Helo');
    });

    it('interpolates data correctly', () => {
      const { result } = renderHook(() => useTranslation());
      const text = result.current.z(
        { en: 'Hello {name}', cy: 'Helo {name}' },
        { name: 'Alice' },
      );
      expect(text).toBe('Hello Alice');
    });

    it('falls back and warns if the translation is missing for the current locale', () => {
      (useLanguage as jest.Mock).mockReturnValue('cy');
      const { result } = renderHook(() => useTranslation());

      const text = result.current.z({ en: 'Only English', cy: undefined });

      expect(text).toBe('<No translation available>');
      expect(consoleWarnMock).toHaveBeenCalledWith(
        'no translation available in [cy] for [Only English]',
      );
    });
  });

  describe('t() json translation', () => {
    it('fetches a top-level string from the locale file', () => {
      const { result } = renderHook(() => useTranslation());
      expect(result.current.t('helloWorld')).toBe('Hello World');
    });

    it('fetches and flattens nested objects', () => {
      const { result } = renderHook(() => useTranslation());
      expect(result.current.t('section.items')).toBe('item1,item2,item3');
    });

    it('fetches from a subfolder correctly', () => {
      const { result } = renderHook(() => useTranslation());
      expect(result.current.t('subfolder/subText')).toBe('Subfolder Hello');
    });

    it('interpolates json values', () => {
      const { result } = renderHook(() => useTranslation());
      expect(result.current.t('greeting', { name: 'Bob' })).toBe('Hello Bob');
    });

    it('returns the fallback key and warns if the key does not exist', () => {
      const { result } = renderHook(() => useTranslation());
      expect(result.current.t('nonExistentKey')).toBe('nonExistentKey');
      expect(consoleWarnMock).toHaveBeenCalledWith(
        'no translation available in en.json for [nonExistentKey]',
      );
    });

    it('returns the fallback key and warns if the subfolder/file does not exist', () => {
      const { result } = renderHook(() => useTranslation());
      expect(result.current.t('badFolder/text')).toBe('badFolder/text');
      // The require fails, throwing it into the catch block
      expect(consoleWarnMock).toHaveBeenCalledWith(
        'no translation available in badFolder/en.json for [text]',
      );
    });
  });

  describe('tList() list fetching', () => {
    it('returns an array from a dot-notated key', () => {
      const { result } = renderHook(() => useTranslation());
      const items = result.current.tList('section.items');

      expect(items).toEqual(['item1', 'item2', 'item3']);
    });

    it('falls back to the key and warns if the list does not exist', () => {
      const { result } = renderHook(() => useTranslation());
      expect(result.current.tList('section.missingList')).toBe(
        'section.missingList',
      );
    });
  });
});

import { useRouter } from 'next/router';

import { renderHook } from '@testing-library/react';

import { useFilterDefaults, useQueryState } from './useQueryState';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('useQueryState', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      query: {},
      asPath: '/',
      push: mockPush,
    });
  });

  describe('basic functionality', () => {
    it('should return query state with empty query', () => {
      (useRouter as jest.Mock).mockReturnValue({
        query: {},
        asPath: '/',
        push: mockPush,
      });

      const { result } = renderHook(() => useQueryState());

      expect(result.current.query).toEqual({});
      expect(result.current.queryWithDefaults).toEqual({});
      expect(result.current.keyword).toBeUndefined();
      expect(result.current.hasKeyword).toBe(false);
      expect(result.current.currentOrder).toBe('published');
    });

    it('should return query state with keyword', () => {
      (useRouter as jest.Mock).mockReturnValue({
        query: { keyword: 'test search' },
        asPath: '/',
        push: mockPush,
      });

      const { result } = renderHook(() => useQueryState());

      expect(result.current.keyword).toBe('test search');
      expect(result.current.hasKeyword).toBe(true);
      expect(result.current.currentOrder).toBe('relevance');
    });

    it('should return query state with order parameter', () => {
      (useRouter as jest.Mock).mockReturnValue({
        query: { order: 'updated' },
        asPath: '/',
        push: mockPush,
      });

      const { result } = renderHook(() => useQueryState());

      expect(result.current.currentOrder).toBe('updated');
    });

    it('should return query state with keyword and order', () => {
      (useRouter as jest.Mock).mockReturnValue({
        query: { keyword: 'test', order: 'published' },
        asPath: '/',
        push: mockPush,
      });

      const { result } = renderHook(() => useQueryState());

      expect(result.current.keyword).toBe('test');
      expect(result.current.hasKeyword).toBe(true);
      expect(result.current.currentOrder).toBe('published');
    });
  });

  describe('queryWithDefaults', () => {
    it('should apply defaults when keyword exists but no order', () => {
      (useRouter as jest.Mock).mockReturnValue({
        query: { keyword: 'test' },
        asPath: '/',
        push: mockPush,
      });

      const { result } = renderHook(() => useQueryState());

      expect(result.current.queryWithDefaults.order).toBe('relevance');
    });

    it('should not override existing order', () => {
      (useRouter as jest.Mock).mockReturnValue({
        query: { keyword: 'test', order: 'updated' },
        asPath: '/',
        push: mockPush,
      });

      const { result } = renderHook(() => useQueryState());

      expect(result.current.queryWithDefaults.order).toBe('updated');
    });
  });

  describe('memoization', () => {
    it('should memoize queryWithDefaults', () => {
      const query = { keyword: 'test' };
      (useRouter as jest.Mock).mockReturnValue({
        query,
        asPath: '/',
        push: mockPush,
      });

      const { result, rerender } = renderHook(() => useQueryState());

      const firstDefaults = result.current.queryWithDefaults;

      // Rerender with same query
      rerender();

      expect(result.current.queryWithDefaults).toBe(firstDefaults);
    });

    it('should update when query changes', () => {
      (useRouter as jest.Mock).mockReturnValue({
        query: { keyword: 'test' },
        asPath: '/',
        push: mockPush,
      });

      const { result, rerender } = renderHook(() => useQueryState());

      const firstKeyword = result.current.keyword;

      // Change query
      (useRouter as jest.Mock).mockReturnValue({
        query: { keyword: 'new search' },
        asPath: '/',
        push: mockPush,
      });

      rerender();

      expect(result.current.keyword).not.toBe(firstKeyword);
      expect(result.current.keyword).toBe('new search');
    });
  });

  describe('edge cases', () => {
    it('should handle empty keyword string', () => {
      (useRouter as jest.Mock).mockReturnValue({
        query: { keyword: '' },
        asPath: '/',
        push: mockPush,
      });

      const { result } = renderHook(() => useQueryState());

      expect(result.current.keyword).toBeUndefined();
      expect(result.current.hasKeyword).toBe(false);
      expect(result.current.currentOrder).toBe('published');
    });

    it('should handle whitespace-only keyword', () => {
      (useRouter as jest.Mock).mockReturnValue({
        query: { keyword: '   ' },
        asPath: '/',
        push: mockPush,
      });

      const { result } = renderHook(() => useQueryState());

      expect(result.current.keyword).toBeUndefined();
      expect(result.current.hasKeyword).toBe(false);
    });

    it('should handle array values in query', () => {
      (useRouter as jest.Mock).mockReturnValue({
        query: { topic: ['pensions', 'savings'] },
        asPath: '/',
        push: mockPush,
      });

      const { result } = renderHook(() => useQueryState());

      expect(result.current.query.topic).toEqual(['pensions', 'savings']);
    });

    it('should handle undefined order in queryWithDefaults', () => {
      (useRouter as jest.Mock).mockReturnValue({
        query: { keyword: 'test' },
        asPath: '/',
        push: mockPush,
      });

      const { result } = renderHook(() => useQueryState());

      // When keyword exists and no order, defaults to relevance
      expect(result.current.currentOrder).toBe('relevance');
    });

    it('should handle order as array', () => {
      (useRouter as jest.Mock).mockReturnValue({
        query: { order: ['published'] },
        asPath: '/',
        push: mockPush,
      });

      const { result } = renderHook(() => useQueryState());

      // Should handle array order by checking if it's a string
      expect(typeof result.current.queryWithDefaults.order).toBe('string');
    });
  });
});

describe('useFilterDefaults', () => {
  it('should return defaults with empty query', () => {
    const { result } = renderHook(() => useFilterDefaults({}));

    expect(result.current.keyword).toBe('');
    expect(result.current.order).toBe('published');
  });

  it('should return defaults with keyword', () => {
    const { result } = renderHook(() =>
      useFilterDefaults({ keyword: 'test search' }),
    );

    expect(result.current.keyword).toBe('test search');
    expect(result.current.order).toBe('relevance');
  });

  it('should return defaults with order', () => {
    const { result } = renderHook(() =>
      useFilterDefaults({ order: 'updated' }),
    );

    expect(result.current.order).toBe('updated');
  });

  it('should return defaults with keyword and order', () => {
    const { result } = renderHook(() =>
      useFilterDefaults({ keyword: 'test', order: 'published' }),
    );

    expect(result.current.keyword).toBe('test');
    expect(result.current.order).toBe('published');
  });

  it('should default to relevance when keyword exists but no order', () => {
    const { result } = renderHook(() => useFilterDefaults({ keyword: 'test' }));

    expect(result.current.order).toBe('relevance');
  });

  it('should default to published when no keyword and no order', () => {
    const { result } = renderHook(() => useFilterDefaults({}));

    expect(result.current.order).toBe('published');
  });

  it('should handle empty keyword string', () => {
    const { result } = renderHook(() => useFilterDefaults({ keyword: '' }));

    expect(result.current.keyword).toBe('');
    expect(result.current.order).toBe('published');
  });

  it('should handle whitespace-only keyword', () => {
    const { result } = renderHook(() => useFilterDefaults({ keyword: '   ' }));

    expect(result.current.keyword).toBe('');
    expect(result.current.order).toBe('published');
  });

  it('should memoize results', () => {
    const query = { keyword: 'test' };
    const { result, rerender } = renderHook(
      ({ query }) => useFilterDefaults(query),
      { initialProps: { query } },
    );

    const firstResult = result.current;

    // Rerender with same query
    rerender({ query });

    expect(result.current).toBe(firstResult);
  });

  it('should update when query changes', () => {
    const { result, rerender } = renderHook(
      ({ query }) => useFilterDefaults(query),
      { initialProps: { query: { keyword: 'test' } } },
    );

    const firstKeyword = result.current.keyword;

    rerender({ query: { keyword: 'new search' } });

    expect(result.current.keyword).not.toBe(firstKeyword);
    expect(result.current.keyword).toBe('new search');
  });
});

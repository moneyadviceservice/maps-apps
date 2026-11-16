import { renderHook } from '@testing-library/react';

import { useIsLg } from './useIsLg';

const addListener = jest.fn();
const removeEventListener = jest.fn();

function createMockMatchMedia(matches: boolean) {
  return jest.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: addListener,
    removeEventListener: removeEventListener,
    dispatchEvent: jest.fn(),
  }));
}

describe('useIsLg', () => {
  const originalMatchMedia = globalThis.matchMedia;

  afterEach(() => {
    Object.defineProperty(globalThis, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    });
    jest.clearAllMocks();
  });

  it('returns false when viewport is below lg breakpoint', () => {
    Object.defineProperty(globalThis, 'matchMedia', {
      writable: true,
      value: createMockMatchMedia(false),
    });

    const { result } = renderHook(() => useIsLg());

    expect(result.current).toBe(false);
  });

  it('returns true when viewport is at least lg', () => {
    Object.defineProperty(globalThis, 'matchMedia', {
      writable: true,
      value: createMockMatchMedia(true),
    });

    const { result } = renderHook(() => useIsLg());

    expect(result.current).toBe(true);
  });

  it('subscribes to media query changes and updates when matches changes', () => {
    let changeHandler: () => void = () => {
      return;
    };
    const mq = {
      matches: false,
      media: '(min-width: 1024px)',
      addEventListener: jest.fn((_event: string, handler: () => void) => {
        changeHandler = handler;
      }),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      onchange: null,
      dispatchEvent: jest.fn(),
    };
    Object.defineProperty(globalThis, 'matchMedia', {
      writable: true,
      value: jest.fn(() => mq),
    });

    const { result, rerender } = renderHook(() => useIsLg());
    expect(result.current).toBe(false);

    mq.matches = true;
    changeHandler();
    rerender();
    expect(result.current).toBe(true);

    mq.matches = false;
    changeHandler();
    rerender();
    expect(result.current).toBe(false);
  });

  it('cleans up listener on unmount', () => {
    const removeEventListenerSpy = jest.fn();
    const mq = {
      matches: false,
      media: '',
      addEventListener: jest.fn(),
      removeEventListener: removeEventListenerSpy,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      onchange: null,
      dispatchEvent: jest.fn(),
    };
    Object.defineProperty(globalThis, 'matchMedia', {
      writable: true,
      value: jest.fn(() => mq),
    });

    const { unmount } = renderHook(() => useIsLg());
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });
});

import { useRouter } from 'next/router';

import { renderHook } from '@testing-library/react';

import { useScrollRestoration } from './useScrollRestoration';

import '@testing-library/jest-dom';

// Extend global type to include test helpers
declare global {
  // eslint-disable-next-line no-var
  var flushRAF: () => void;
  // eslint-disable-next-line no-var
  var flushTimeout: () => void;
}

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('useScrollRestoration', () => {
  const mockRouterEvents = {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  };

  // Helper functions to reduce duplication
  const getCompleteHandler = () => {
    return mockRouterEvents.on.mock.calls.find(
      (call: [string, (url: string) => void]) =>
        call[0] === 'routeChangeComplete',
    )?.[1];
  };

  const createMockElement = (id: string, hasTabIndex = false) => {
    const mockElement = document.createElement('div');
    mockElement.id = id;
    mockElement.focus = jest.fn();
    mockElement.getBoundingClientRect = jest.fn(() => ({
      top: 500,
      left: 0,
      bottom: 600,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 500,
      toJSON: jest.fn(),
    }));
    mockElement.hasAttribute = jest.fn(() => hasTabIndex);
    mockElement.setAttribute = jest.fn();
    mockElement.removeAttribute = jest.fn();
    return mockElement;
  };

  const setWindowLocation = (hash: string) => {
    Object.defineProperty(window, 'location', {
      value: {
        hash,
        pathname: '/test',
        search: '',
      },
      writable: true,
      configurable: true,
    });
  };

  const flushCallbacks = () => {
    global.flushTimeout();
    global.flushRAF();
    global.flushRAF();
  };

  const mockPush = jest.fn();
  const mockScrollTo = jest.fn();
  let rafCallbacks: FrameRequestCallback[] = [];
  let timeoutCallbacks: (() => void)[] = [];
  const mockRequestAnimationFrame = jest.fn((cb: FrameRequestCallback) => {
    rafCallbacks.push(cb);
    return rafCallbacks.length;
  });
  const mockSetTimeout = jest.fn((cb: () => void) => {
    timeoutCallbacks.push(cb);
    return timeoutCallbacks.length;
  });

  let originalScrollTo: typeof window.scrollTo;
  let originalRequestAnimationFrame: typeof window.requestAnimationFrame;
  let originalSetTimeout: typeof window.setTimeout;
  let originalHistory: History;

  const setupWindowProperty = (
    obj: Window | Document | HTMLElement,
    prop: string,
    value: unknown,
  ) => {
    Object.defineProperty(obj, prop, {
      value,
      writable: true,
      configurable: true,
    });
  };

  const setupWindowProperties = () => {
    setupWindowProperty(window, 'scrollY', 0);
    setupWindowProperty(window, 'pageYOffset', 0);
    setupWindowProperty(window, 'innerHeight', 800);
    setupWindowProperty(document.documentElement, 'scrollTop', 0);
    setupWindowProperty(document.body, 'scrollHeight', 2000);
  };

  const setupWindowLocation = (hash: string) => {
    setupWindowProperty(window, 'location', {
      hash,
      pathname: '/test',
      search: '',
    });
  };

  const setupHistory = (scrollRestoration: string) => {
    setupWindowProperty(window, 'history', {
      ...window.history,
      scrollRestoration,
    });
  };

  const setupRouter = () => {
    (useRouter as ReturnType<typeof jest.fn>).mockReturnValue({
      asPath: '/test',
      route: '/test',
      pathname: '/test',
      query: {},
      basePath: '',
      isLocaleDomain: false,
      events: mockRouterEvents,
      push: mockPush,
    } as unknown as ReturnType<typeof useRouter>);
  };

  const executeRAFCallbacks = (callbacks: FrameRequestCallback[]) => {
    callbacks.forEach((cb) => cb(0));
  };

  const flushRAFCallbacks = () => {
    let iterations = 0;
    const maxIterations = 10;
    while (rafCallbacks.length > 0 && iterations < maxIterations) {
      const callbacks = [...rafCallbacks];
      rafCallbacks = [];
      executeRAFCallbacks(callbacks);
      iterations++;
    }
  };

  const flushTimeoutCallbacks = () => {
    const callbacks = [...timeoutCallbacks];
    timeoutCallbacks = [];
    callbacks.forEach((cb) => cb());
  };

  const executeRAFUntilSafetyValve = (maxAttempts: number) => {
    let executedCount = 0;
    while (executedCount <= maxAttempts) {
      if (rafCallbacks.length === 0) break;
      const cb = rafCallbacks.shift();
      if (cb) {
        cb(0);
        executedCount++;
      }
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    rafCallbacks = [];
    timeoutCallbacks = [];

    originalScrollTo = window.scrollTo;
    window.scrollTo = mockScrollTo;

    originalRequestAnimationFrame = window.requestAnimationFrame;
    window.requestAnimationFrame =
      mockRequestAnimationFrame as typeof window.requestAnimationFrame;

    originalSetTimeout = global.setTimeout;
    global.setTimeout = mockSetTimeout as unknown as typeof setTimeout;

    originalHistory = window.history;
    setupHistory('auto');

    setupWindowProperties();
    setupWindowLocation('');

    setupRouter();

    mockRequestAnimationFrame.mockImplementation((cb: FrameRequestCallback) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });

    global.flushRAF = flushRAFCallbacks;
    global.flushTimeout = flushTimeoutCallbacks;
  });

  afterEach(() => {
    // Restore originals
    window.scrollTo = originalScrollTo;
    window.requestAnimationFrame = originalRequestAnimationFrame;
    global.setTimeout = originalSetTimeout;
    Object.defineProperty(window, 'history', {
      value: originalHistory,
      writable: true,
      configurable: true,
    });
  });

  describe('browser scroll restoration disabling', () => {
    it('should disable browser native scroll restoration', () => {
      renderHook(() => useScrollRestoration());

      expect(window.history.scrollRestoration).toBe('manual');
    });

    it('should handle missing scrollRestoration property gracefully', () => {
      setupWindowProperty(window, 'history', {});

      expect(() => renderHook(() => useScrollRestoration())).not.toThrow();
    });
  });

  describe('event listeners setup', () => {
    it('should register routeChangeComplete event listener', () => {
      renderHook(() => useScrollRestoration());

      expect(mockRouterEvents.on).toHaveBeenCalledWith(
        'routeChangeComplete',
        expect.any(Function),
      );
    });

    it('should cleanup event listeners on unmount', () => {
      const { unmount } = renderHook(() => useScrollRestoration());

      unmount();

      expect(mockRouterEvents.off).toHaveBeenCalledWith(
        'routeChangeComplete',
        expect.any(Function),
      );
    });
  });

  describe('scroll to top for regular navigation', () => {
    it('should scroll to top on navigation without hash', () => {
      renderHook(() => useScrollRestoration());

      const completeHandler = getCompleteHandler();
      completeHandler?.('/new-page');

      flushCallbacks();

      expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
    });

    it('should scroll to top when navigating back from hash on same page', () => {
      setWindowLocation('#section');
      renderHook(() => useScrollRestoration());

      const completeHandler = getCompleteHandler();
      completeHandler?.('/test#section');

      flushCallbacks();

      mockScrollTo.mockClear();
      setWindowLocation('');
      completeHandler?.('/test');

      flushCallbacks();

      expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
    });

    it('should wait for content to be ready before scrolling', () => {
      renderHook(() => useScrollRestoration());

      const completeHandler = getCompleteHandler();
      completeHandler?.('/new-page');

      // Flush setTimeout first
      global.flushTimeout();

      // Should call requestAnimationFrame to check content
      expect(mockRequestAnimationFrame).toHaveBeenCalled();

      // Content is ready (body height > viewport), so should scroll
      // Flush RAF callbacks (double RAF for scroll)
      global.flushRAF();

      expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('hash link scrolling', () => {
    it('should scroll to hash element when hash is present in URL', () => {
      const mockElement = createMockElement('section');
      document.getElementById = jest.fn(() => mockElement);

      setWindowLocation('#section');

      renderHook(() => useScrollRestoration());

      const completeHandler = getCompleteHandler();
      completeHandler?.('/test#section');

      flushCallbacks();

      expect(document.getElementById).toHaveBeenCalledWith('section');
      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 500,
        behavior: 'smooth',
      });
      expect(mockElement.focus).toHaveBeenCalled();
    });

    it('should scroll to top if hash element is not found', () => {
      document.getElementById = jest.fn(() => null);

      setWindowLocation('#nonexistent');

      renderHook(() => useScrollRestoration());

      const completeHandler = getCompleteHandler();
      completeHandler?.('/test#nonexistent');

      flushCallbacks();

      expect(document.getElementById).toHaveBeenCalledWith('nonexistent');
      // Should fall back to scrolling to top
      expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
    });

    it('should extract hash from URL parameter if window.location.hash is empty', () => {
      const mockElement = createMockElement('section');
      document.getElementById = jest.fn(() => mockElement);

      setWindowLocation('');

      renderHook(() => useScrollRestoration());

      const completeHandler = getCompleteHandler();
      // URL has hash but window.location.hash doesn't (simulating Next.js behavior)
      completeHandler?.('/test#section');

      flushCallbacks();

      expect(document.getElementById).toHaveBeenCalledWith('section');
      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 500,
        behavior: 'smooth',
      });
    });

    it('should handle empty hash gracefully', () => {
      setWindowLocation('#');

      renderHook(() => useScrollRestoration());

      const completeHandler = getCompleteHandler();
      completeHandler?.('/test#');

      flushCallbacks();

      // Should scroll to top when hash is empty
      expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
    });

    it('should add and remove tabindex for accessibility when focusing hash element', () => {
      const mockElement = createMockElement('section', false);
      document.getElementById = jest.fn(() => mockElement);

      setWindowLocation('#section');

      renderHook(() => useScrollRestoration());

      const completeHandler = getCompleteHandler();
      completeHandler?.('/test#section');

      flushCallbacks();

      expect(mockElement.setAttribute).toHaveBeenCalledWith('tabindex', '-1');
      expect(mockElement.focus).toHaveBeenCalled();
      expect(mockElement.removeAttribute).toHaveBeenCalledWith('tabindex');
    });

    it('should preserve existing tabindex when focusing hash element', () => {
      const mockElement = createMockElement('section', true);
      document.getElementById = jest.fn(() => mockElement);

      setWindowLocation('#section');

      renderHook(() => useScrollRestoration());

      const completeHandler = getCompleteHandler();
      completeHandler?.('/test#section');

      flushCallbacks();

      // Should not set tabindex if it already exists
      expect(mockElement.setAttribute).not.toHaveBeenCalledWith(
        'tabindex',
        '-1',
      );
      expect(mockElement.focus).toHaveBeenCalled();
      // Should not remove tabindex if it existed before
      expect(mockElement.removeAttribute).not.toHaveBeenCalledWith('tabindex');
    });
  });

  describe('edge cases', () => {
    it('should handle SSR (window undefined)', () => {
      const originalWindow = global.window;
      // @ts-expect-error - intentionally setting to undefined for SSR test
      global.window = undefined;

      expect(() => renderHook(() => useScrollRestoration())).not.toThrow();

      global.window = originalWindow;
    });

    it('should handle content that takes time to load', () => {
      // Start with content not ready
      Object.defineProperty(document.body, 'scrollHeight', {
        value: 500,
        writable: true,
        configurable: true,
      });

      renderHook(() => useScrollRestoration());

      const completeHandler = getCompleteHandler();
      completeHandler?.('/new-page');

      global.flushTimeout();

      // First RAF check - content not ready, will schedule another RAF
      // Flush one RAF callback
      if (rafCallbacks.length > 0) {
        const cb = rafCallbacks.shift();
        cb?.(0);
      }

      // Update content to be ready
      Object.defineProperty(document.body, 'scrollHeight', {
        value: 2000,
        writable: true,
        configurable: true,
      });

      // Now flush remaining RAF callbacks - should scroll
      global.flushRAF();

      expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
    });

    it('should trigger safety valve and scroll after MAX_CONTENT_WAIT_ATTEMPTS', () => {
      const MAX_CONTENT_WAIT_ATTEMPTS = 50;
      setupWindowProperty(document.body, 'scrollHeight', 500);

      renderHook(() => useScrollRestoration());

      const completeHandler = getCompleteHandler();
      completeHandler?.('/new-page');

      global.flushTimeout();

      expect(mockScrollTo).not.toHaveBeenCalled();

      executeRAFUntilSafetyValve(MAX_CONTENT_WAIT_ATTEMPTS);

      expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
    });

    it('should trigger safety valve with hash and scroll to hash element', () => {
      const MAX_CONTENT_WAIT_ATTEMPTS = 50;
      const mockElement = createMockElement('section');
      document.getElementById = jest.fn(() => mockElement);
      setupWindowProperty(document.body, 'scrollHeight', 500);
      setWindowLocation('#section');

      renderHook(() => useScrollRestoration());

      const completeHandler = getCompleteHandler();
      completeHandler?.('/test#section');

      global.flushTimeout();

      expect(mockScrollTo).not.toHaveBeenCalled();

      executeRAFUntilSafetyValve(MAX_CONTENT_WAIT_ATTEMPTS);

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 500,
        behavior: 'smooth',
      });
      expect(mockElement.focus).toHaveBeenCalled();
    });
  });
});

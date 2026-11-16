import { useRouter } from 'next/router';

import { act, renderHook } from '@testing-library/react';

import { useFilterLoading } from './useFilterLoading';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

type Handler = (...args: unknown[]) => void;

function createRouterMock(pathname = '/[language]/results') {
  const handlers: Record<string, Handler[]> = {};
  const events = {
    on: jest.fn((event: string, handler: Handler) => {
      handlers[event] = handlers[event] ?? [];
      handlers[event].push(handler);
    }),
    off: jest.fn((event: string, handler: Handler) => {
      handlers[event] = (handlers[event] ?? []).filter((h) => h !== handler);
    }),
    emit: (event: string, ...args: unknown[]) => {
      (handlers[event] ?? []).forEach((handler) => handler(...args));
    },
  };
  return {
    pathname,
    asPath: '/en/results',
    push: jest.fn(),
    query: { language: 'en' },
    events,
    handlers,
  };
}

type RouterMock = ReturnType<typeof createRouterMock>;

function emitStart(
  router: RouterMock,
  url = '/en/results?sort=distance',
  shallow = false,
) {
  act(() => {
    router.events.emit('routeChangeStart', url, { shallow });
  });
}

describe('useFilterLoading', () => {
  const mockedUseRouter = useRouter as jest.Mock;

  function setup() {
    const router = createRouterMock();
    mockedUseRouter.mockReturnValue(router);
    return { router, ...renderHook(() => useFilterLoading()) };
  }

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-06-04T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    mockedUseRouter.mockReset();
  });

  it('starts with isFilterLoading=false', () => {
    const { result } = setup();
    expect(result.current.isFilterLoading).toBe(false);
  });

  it('flips to loading on same-pathname routeChangeStart', () => {
    const { router, result } = setup();

    emitStart(router);

    expect(result.current.isFilterLoading).toBe(true);
  });

  it('does not flip to loading when destination pathname differs', () => {
    const { router, result } = setup();

    emitStart(router, '/en');

    expect(result.current.isFilterLoading).toBe(false);
  });

  it('ignores shallow route changes', () => {
    const { router, result } = setup();

    emitStart(router, '/en/results?sort=distance', true);

    expect(result.current.isFilterLoading).toBe(false);
  });

  it('clears loading immediately on routeChangeComplete when min-skeleton elapsed', () => {
    const { router, result } = setup();

    emitStart(router);
    expect(result.current.isFilterLoading).toBe(true);

    act(() => {
      jest.advanceTimersByTime(400);
    });
    act(() => {
      router.events.emit('routeChangeComplete');
    });

    expect(result.current.isFilterLoading).toBe(false);
  });

  it('keeps loading true until min-skeleton window elapses on fast responses', () => {
    const { router, result } = setup();

    emitStart(router);
    act(() => {
      jest.advanceTimersByTime(50);
    });
    act(() => {
      router.events.emit('routeChangeComplete');
    });
    expect(result.current.isFilterLoading).toBe(true);

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.isFilterLoading).toBe(false);
  });

  it('clears loading on routeChangeError', () => {
    const { router, result } = setup();

    emitStart(router);
    act(() => {
      router.events.emit('routeChangeError');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.isFilterLoading).toBe(false);
  });

  it('does not reset min-skeleton timestamp on a second concurrent start', () => {
    const { router, result } = setup();

    emitStart(router);
    act(() => {
      jest.advanceTimersByTime(200);
    });
    emitStart(router, '/en/results?sort=price');
    act(() => {
      jest.advanceTimersByTime(101);
    });
    act(() => {
      router.events.emit('routeChangeComplete');
    });

    expect(result.current.isFilterLoading).toBe(false);
  });

  it('removes listeners and clears timers on unmount', () => {
    const { router, unmount } = setup();

    expect(router.events.on).toHaveBeenCalledWith(
      'routeChangeStart',
      expect.any(Function),
    );
    expect(router.events.on).toHaveBeenCalledWith(
      'routeChangeComplete',
      expect.any(Function),
    );
    expect(router.events.on).toHaveBeenCalledWith(
      'routeChangeError',
      expect.any(Function),
    );

    unmount();

    expect(router.events.off).toHaveBeenCalledWith(
      'routeChangeStart',
      expect.any(Function),
    );
    expect(router.events.off).toHaveBeenCalledWith(
      'routeChangeComplete',
      expect.any(Function),
    );
    expect(router.events.off).toHaveBeenCalledWith(
      'routeChangeError',
      expect.any(Function),
    );
  });
});

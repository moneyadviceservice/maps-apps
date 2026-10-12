import { act, renderHook } from '@testing-library/react';

import { useLiveChat } from './useLiveChat';

describe('useLiveChat', () => {
  const mockGenesys = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockGenesys.mockImplementation((...args: unknown[]) => {
      if (args[0] === 'command' && args[1] === 'Messenger.open') {
        const onDone = args[4];
        if (typeof onDone === 'function') {
          (onDone as () => void)();
        }
      }
    });
    (window as Window & { Genesys?: typeof mockGenesys }).Genesys = mockGenesys;
  });

  afterEach(() => {
    delete (window as Window & { Genesys?: typeof mockGenesys }).Genesys;
  });

  it('returns toggleChat', () => {
    const { result } = renderHook(() => useLiveChat());

    expect(result.current.toggleChat).toEqual(expect.any(Function));
  });

  it('invokes Genesys Messenger open and close when Genesys is available', () => {
    const { result } = renderHook(() => useLiveChat());

    act(() => {
      result.current.toggleChat();
    });

    expect(mockGenesys).toHaveBeenCalledWith(
      'command',
      'Messenger.open',
      {},
      null,
      expect.any(Function),
    );
    expect(mockGenesys).toHaveBeenCalledWith('command', 'Messenger.close');
  });

  it('does not throw when Genesys is missing', () => {
    delete (window as Window & { Genesys?: typeof mockGenesys }).Genesys;

    const { result } = renderHook(() => useLiveChat());

    expect(() =>
      act(() => {
        result.current.toggleChat();
      }),
    ).not.toThrow();
  });

  it('does not throw when Genesys throws', () => {
    mockGenesys.mockImplementation(() => {
      throw new Error('Genesys unavailable');
    });

    const { result } = renderHook(() => useLiveChat());

    expect(() =>
      act(() => {
        result.current.toggleChat();
      }),
    ).not.toThrow();
  });
});

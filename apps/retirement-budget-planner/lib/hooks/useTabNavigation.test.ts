import { useRouter } from 'next/router';

import { act, renderHook } from '@testing-library/react';

import { useTabNavigation } from './useTabNavigation';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('test useTabNavigation functionality', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    mockPush.mockClear();
  });

  it('should call onEnableNext and router.push when nextTabId is present', () => {
    const nextTabId = 'tab2';
    const onEnableNext = jest.fn();

    const { result } = renderHook(() =>
      useTabNavigation(nextTabId, onEnableNext),
    );

    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.MouseEvent<HTMLButtonElement>;

    act(() => {
      result.current.onNextClick(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(onEnableNext).toHaveBeenCalledWith(nextTabId);
    expect(mockPush).toHaveBeenCalledWith(`/?tab=${nextTabId}`, undefined, {
      shallow: true,
    });
  });

  it('should do nothing if nextTabId is undefined', () => {
    const onEnableNext = jest.fn();

    const { result } = renderHook(() =>
      useTabNavigation(undefined, onEnableNext),
    );

    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.MouseEvent<HTMLButtonElement>;

    act(() => {
      result.current.onNextClick(mockEvent);
    });

    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    expect(onEnableNext).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});

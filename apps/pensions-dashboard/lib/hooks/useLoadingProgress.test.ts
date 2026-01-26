import { act, renderHook } from '@testing-library/react';

import { useLoadingProgress } from './useLoadingProgress';

// Mock timers
jest.useFakeTimers();

describe('useLoadingProgress', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return correct initial values', () => {
    const { result } = renderHook(() =>
      useLoadingProgress({
        duration: 10,
        durationLeft: 5,
        progressComplete: 'complete',
      }),
    );

    expect(result.current.timeLeft).toBe(5);
    expect(result.current.progressPercent).toBe(50);
    expect(result.current.progressLabel).toBe('50% complete...');
    expect(result.current.announcementText).toBe('');
  });

  it('should announce progress after 5 seconds', () => {
    const { result } = renderHook(() =>
      useLoadingProgress({
        duration: 10,
        durationLeft: 5,
        progressComplete: 'complete',
      }),
    );

    // Initial state: durationLeft=5, so progress = (10-5)/10 = 50%
    expect(result.current.timeLeft).toBe(5);
    expect(result.current.progressPercent).toBe(50);
    expect(result.current.announcementText).toBe('');

    // Fast forward 5 seconds - timeLeft becomes 0, progress becomes 100%
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.timeLeft).toBe(0);
    expect(result.current.progressPercent).toBe(100);
    expect(result.current.announcementText).toBe('50% complete...');
  });

  it('should clear announcement after clearDelayMs', () => {
    const { result } = renderHook(() =>
      useLoadingProgress({
        duration: 10,
        durationLeft: 5,
        progressComplete: 'complete',
        clearDelayMs: 2000,
      }),
    );

    // Fast forward 5 seconds to trigger announcement
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // After 5 seconds, timeLeft becomes 0, progress becomes 100%
    expect(result.current.announcementText).toBe('50% complete...');

    // Fast forward 2 more seconds to clear announcement
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.announcementText).toBe('');
  });

  it('should announce again after another interval', () => {
    const { result } = renderHook(() =>
      useLoadingProgress({
        duration: 20,
        durationLeft: 10,
        progressComplete: 'complete',
      }),
    );

    // Check initial state
    expect(result.current.timeLeft).toBe(10);
    expect(result.current.progressPercent).toBe(50);

    // First announcement at 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // After 5 seconds, timeLeft should be 5, so progress should be (20-5)/20 = 75%
    expect(result.current.timeLeft).toBe(5);
    expect(result.current.progressPercent).toBe(75);
    expect(result.current.announcementText).toBe('50% complete...');

    // Clear announcement
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.announcementText).toBe('');

    // Second announcement at 10 seconds total
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.announcementText).toBe('90% complete...');
  });

  it('should countdown automatically', () => {
    const { result } = renderHook(() =>
      useLoadingProgress({
        duration: 10,
        durationLeft: 3,
        progressComplete: 'complete',
      }),
    );

    expect(result.current.timeLeft).toBe(3);
    expect(result.current.progressPercent).toBe(70);

    // Fast forward 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.timeLeft).toBe(2);
    expect(result.current.progressPercent).toBe(80);

    // Fast forward 2 more seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.timeLeft).toBe(0);
    expect(result.current.progressPercent).toBe(100);
  });

  it('should show no ellipsis when progress is 100%', () => {
    const { result } = renderHook(() =>
      useLoadingProgress({
        duration: 10,
        durationLeft: 0,
        progressComplete: 'complete',
      }),
    );

    expect(result.current.progressPercent).toBe(100);
    expect(result.current.progressLabel).toBe('100% complete');

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.announcementText).toBe('100% complete');
  });

  it('should use custom interval and clear delay', () => {
    const { result } = renderHook(() =>
      useLoadingProgress({
        duration: 20,
        durationLeft: 10,
        progressComplete: 'done',
        intervalMs: 3000,
        clearDelayMs: 1000,
      }),
    );

    // Check initial state
    expect(result.current.timeLeft).toBe(10);
    expect(result.current.progressPercent).toBe(50);

    // Should not announce at 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.announcementText).toBe('');

    // Should announce at 3 seconds - timeLeft should be 7, progress (20-7)/20 = 65%
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.timeLeft).toBe(7);
    expect(result.current.progressPercent).toBe(65);
    expect(result.current.announcementText).toBe('60% done...');

    // Should clear at 4 seconds (3 + 1)
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.announcementText).toBe('');
  });

  it('should call onComplete after countdown finishes', () => {
    const onComplete = jest.fn();

    renderHook(() =>
      useLoadingProgress({
        duration: 10,
        durationLeft: 1,
        progressComplete: 'complete',
        onComplete,
      }),
    );

    // Fast forward 1 second to reach 0
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Fast forward 2 more seconds to trigger onComplete
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(onComplete).toHaveBeenCalled();
  });

  it('should cleanup intervals and timeouts on unmount', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const { unmount } = renderHook(() =>
      useLoadingProgress({
        duration: 10,
        durationLeft: 5,
        progressComplete: 'complete',
      }),
    );

    // Trigger an announcement to create a timeout
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearIntervalSpy.mockRestore();
    clearTimeoutSpy.mockRestore();
  });

  it('should calculate progress values correctly for different scenarios', () => {
    const testCases = [
      {
        duration: 100,
        timeLeft: 75,
        expectedPercent: 25,
        expectedLabel: '25% loading...',
      },
      {
        duration: 60,
        timeLeft: 30,
        expectedPercent: 50,
        expectedLabel: '50% loading...',
      },
      {
        duration: 20,
        timeLeft: 0,
        expectedPercent: 100,
        expectedLabel: '100% loading',
      },
      {
        duration: 15,
        timeLeft: 12,
        expectedPercent: 20,
        expectedLabel: '20% processing...',
      },
    ];

    testCases.forEach(
      ({ duration, timeLeft, expectedPercent, expectedLabel }, index) => {
        const progressComplete = index === 3 ? 'processing' : 'loading';
        const { result } = renderHook(() =>
          useLoadingProgress({
            duration,
            durationLeft: timeLeft,
            progressComplete,
          }),
        );

        expect(result.current.progressPercent).toBe(expectedPercent);
        expect(result.current.progressLabel).toBe(expectedLabel);
      },
    );
  });
});

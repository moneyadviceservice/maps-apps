import { KeyboardEvent, MouseEvent } from 'react';

import { act, renderHook } from '@testing-library/react';

import { isActionableEvent, useLogoutHandler } from './useLogoutHandler';

// Helper function to create mock keyboard events
const createMockKeyboardEvent = (key: string): KeyboardEvent<HTMLElement> =>
  ({
    key,
    preventDefault: jest.fn(),
    type: 'keydown',
  } as unknown as KeyboardEvent<HTMLElement>);

// Helper function to create mock mouse events
const createMockMouseEvent = (): MouseEvent<HTMLElement> =>
  ({
    preventDefault: jest.fn(),
    type: 'click',
  } as unknown as MouseEvent<HTMLElement>);

describe('useLogoutHandler', () => {
  it('should return true for Enter key', () => {
    const event = createMockKeyboardEvent('Enter');
    expect(isActionableEvent(event)).toBe(true);
  });

  it('should return true for Space key', () => {
    const event = createMockKeyboardEvent(' ');
    expect(isActionableEvent(event)).toBe(true);
  });

  it('should return true for Spacebar key', () => {
    const event = createMockKeyboardEvent('Spacebar');
    expect(isActionableEvent(event)).toBe(true);
  });

  it('should return false for other keyboard keys', () => {
    const event = createMockKeyboardEvent('Escape');
    expect(isActionableEvent(event)).toBe(false);
  });

  it('should return true for mouse events', () => {
    const event = createMockMouseEvent();
    expect(isActionableEvent(event)).toBe(true);
  });

  it('should initialize with isLogoutModalOpen as false', () => {
    const { result } = renderHook(() => useLogoutHandler());

    expect(result.current.isLogoutModalOpen).toBe(false);
  });

  it('should open modal when handleLogout is called with actionable keyboard event', () => {
    const { result } = renderHook(() => useLogoutHandler());
    const event = createMockKeyboardEvent('Enter');

    act(() => {
      result.current.handleLogout(event);
    });

    expect(result.current.isLogoutModalOpen).toBe(true);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should open modal when handleLogout is called with mouse event', () => {
    const { result } = renderHook(() => useLogoutHandler());
    const event = createMockMouseEvent();

    act(() => {
      result.current.handleLogout(event);
    });

    expect(result.current.isLogoutModalOpen).toBe(true);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should not open modal when handleLogout is called with non-actionable keyboard event', () => {
    const { result } = renderHook(() => useLogoutHandler());
    const event = createMockKeyboardEvent('Escape');

    result.current.handleLogout(event);

    result.current.setIsLogoutModalOpen(false);
    expect(result.current.isLogoutModalOpen).toBe(false);
  });

  it('should allow modal state to be controlled via setIsLogoutModalOpen', () => {
    const { result } = renderHook(() => useLogoutHandler());

    act(() => {
      result.current.setIsLogoutModalOpen(true);
    });
    expect(result.current.isLogoutModalOpen).toBe(true);

    act(() => {
      result.current.setIsLogoutModalOpen(false);
    });
    expect(result.current.isLogoutModalOpen).toBe(false);
  });

  it('should maintain handleLogout function reference between renders', () => {
    const { result, rerender } = renderHook(() => useLogoutHandler());
    const firstHandleLogout = result.current.handleLogout;

    rerender();

    expect(result.current.handleLogout).toBe(firstHandleLogout);
  });
});

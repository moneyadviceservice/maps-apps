import { renderHook, act } from '@testing-library/react';
import useAnnouncement from './useAnnouncement';

describe('useAnnouncement', () => {
  it('initially has empty announcement and default politeness', () => {
    const { result } = renderHook(() => useAnnouncement());

    expect(result.current.announcement).toBe('');
    expect(result.current.liveRegionProps.children).toBe('');
    expect(result.current.liveRegionProps['aria-live']).toBe('assertive');
  });

  it('updates announcement when announce is called', () => {
    const { result } = renderHook(() => useAnnouncement());

    act(() => {
      result.current.announce('Hello world');
    });

    expect(result.current.announcement).toBe('Hello world');
    expect(result.current.liveRegionProps.children).toBe('Hello world');
  });

  it('overwrites previous announcement', () => {
    const { result } = renderHook(() => useAnnouncement());

    act(() => {
      result.current.announce('First');
    });

    expect(result.current.announcement).toBe('First');

    act(() => {
      result.current.announce('Second');
    });

    expect(result.current.announcement).toBe('Second');
  });

  it('allows overriding politeness per announcement', () => {
    const { result } = renderHook(() =>
      useAnnouncement({ defaultPoliteness: 'polite' }),
    );

    act(() => {
      result.current.announce('Error message', { politeness: 'assertive' });
    });

    expect(result.current.liveRegionProps['aria-live']).toBe('assertive');
  });

  it('falls back to default politeness when not provided', () => {
    const { result } = renderHook(() =>
      useAnnouncement({ defaultPoliteness: 'assertive' }),
    );

    act(() => {
      result.current.announce('Message');
    });

    expect(result.current.liveRegionProps['aria-live']).toBe('assertive');
  });
});

/// <reference types="jest" />
import { render, renderHook, screen } from '@testing-library/react';

import { useLiveAnnouncer } from './useLiveAnnouncer';

describe('useLiveAnnouncer hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an object with a ref and an announce function', () => {
    const { result } = renderHook(() => useLiveAnnouncer({}));

    expect(result.current.ref).toBeDefined();
    expect(result.current.ref.current).toBeNull();
    expect(typeof result.current.announce).toBe('function');
  });

  it('should alternately append a word joiner character to the message when announce is called multiple times consecutively with the same message, in the default configuration', async () => {
    let announceRef: (message: string) => void;

    const TestComponentWithCapture = () => {
      const { ref, announce } = useLiveAnnouncer({});
      announceRef = announce;
      return <div ref={ref} role="status" aria-live="polite" />;
    };

    render(<TestComponentWithCapture />);
    const statusElement = screen.getByRole('status');
    const testMessage = 'Test announcement';

    for (let i = 0; i < 2; i++) {
      // @ts-expect-error announceRef is assigned during test component render
      announceRef(testMessage);
      expect(statusElement.textContent).toBe(testMessage);

      // @ts-expect-error announceRef is assigned during test component render
      announceRef(testMessage);
      expect(statusElement.textContent).toBe(`${testMessage}\u2060`);
    }
  });

  it('should not modify the message when announce is called multiple times consecutively with the same message, when configured to not re-announce identical (consecutive) messages', () => {
    let announceRef: (message: string) => void;

    const TestComponentWithCapture = () => {
      const { ref, announce } = useLiveAnnouncer({
        reAnnounceIdenticalMessages: false,
      });
      announceRef = announce;
      return <div ref={ref} role="status" aria-live="polite" />;
    };

    render(<TestComponentWithCapture />);
    const statusElement = screen.getByRole('status');
    const testMessage = 'Test announcement';

    for (let i = 0; i < 4; i++) {
      // @ts-expect-error announceRef is assigned during test component render
      announceRef(testMessage);
      expect(statusElement.textContent).toBe(testMessage);
    }
  });

  it('should handle a missing ref gracefully', () => {
    let announceRef: (message: string) => void;

    const TestComponentWithCapture = () => {
      const { announce } = useLiveAnnouncer({});
      announceRef = announce;
      return <div role="status" aria-live="polite" />;
    };

    render(<TestComponentWithCapture />);
    const statusElement = screen.getByRole('status');
    const testMessage = 'Test announcement';

    // @ts-expect-error announceRef is assigned during test component render
    announceRef(testMessage);
    expect(statusElement.textContent).toBe('');
  });

  it('should work correctly with HTMLElement types other than the default - paragraph', async () => {
    let announceRef: (message: string) => void;

    const TestComponentWithCapture = () => {
      const { ref, announce } = useLiveAnnouncer<HTMLParagraphElement>({});
      announceRef = announce;
      return <p ref={ref} role="status" aria-live="polite" />;
    };

    render(<TestComponentWithCapture />);
    const statusElement = screen.getByRole('status');
    const testMessage = 'Test announcement';
    // @ts-expect-error announceRef is assigned during test component render
    announceRef(testMessage);
    expect(statusElement.textContent).toBe(testMessage);
  });

  it('should work correctly with HTMLElement types other than the default - span', async () => {
    let announceRef: (message: string) => void;

    const TestComponentWithCapture = () => {
      const { ref, announce } = useLiveAnnouncer<HTMLParagraphElement>({});
      announceRef = announce;
      return <span ref={ref} role="status" aria-live="polite" />;
    };

    render(<TestComponentWithCapture />);
    const statusElement = screen.getByRole('status');
    const testMessage = 'Test announcement';
    // @ts-expect-error announceRef is assigned during test component render
    announceRef(testMessage);
    expect(statusElement.textContent).toBe(testMessage);
  });

  it('should work correctly with HTMLElement types other than the default - output', async () => {
    let announceRef: (message: string) => void;

    const TestComponentWithCapture = () => {
      const { ref, announce } = useLiveAnnouncer<HTMLOutputElement>({});
      announceRef = announce;
      return <output ref={ref} aria-live="polite" />;
    };

    render(<TestComponentWithCapture />);
    const statusElement = screen.getByRole('status');
    const testMessage = 'Test announcement';
    // @ts-expect-error announceRef is assigned during test component render
    announceRef(testMessage);
    expect(statusElement.textContent).toBe(testMessage);
  });
});

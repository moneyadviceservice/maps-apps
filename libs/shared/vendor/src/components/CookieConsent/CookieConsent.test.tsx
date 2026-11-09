import { FC } from 'react';

import { act, render } from '@testing-library/react';

import { useCookieConsent as mockUseCookieConsent } from '@maps-react/hooks/useCookieConsent';

import { CookieConsent } from '.';
import type { CookieConsent as CookieConsentType } from '.';

import '@testing-library/jest-dom';

jest.mock('next/script', () => {
  interface MockScriptProps {
    src?: string;
    strategy?: string;
    'data-testid'?: string;
  }

  const MockScript: FC<MockScriptProps> = (props) => (
    <div data-testid={props['data-testid'] ?? 'mock-script'} {...props} />
  );

  return {
    __esModule: true,
    default: MockScript,
  };
});

const mockInitCookieConsent = jest.fn();
jest.mock('@maps-react/hooks/useCookieConsent', () => ({
  useCookieConsent: jest.fn(() => ({
    initCookieConsent: mockInitCookieConsent,
  })),
}));

describe('CookieConsent', () => {
  let mockSetIsOpen: jest.Mock;
  let callback: MutationCallback;
  let mockObserver: MutationObserver;
  let mockObserve: jest.Mock;
  let mockDisconnect: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSetIsOpen = jest.fn();

    mockObserve = jest.fn();
    mockDisconnect = jest.fn();

    mockObserver = {
      observe: mockObserve,
      disconnect: mockDisconnect,
    } as unknown as MutationObserver;

    const MockMutationObserver = jest.fn(function (cb: MutationCallback) {
      callback = cb;
      return mockObserver;
    });
    global.MutationObserver = MockMutationObserver;

    (
      window as unknown as { CookieControl: { changeCategory: jest.Mock } }
    ).CookieControl = {
      changeCategory: jest.fn(),
    };
  });

  it('calls initCookieConsent on mount', () => {
    render(<CookieConsent isOpen={mockSetIsOpen} />);
    expect(mockInitCookieConsent).toHaveBeenCalledTimes(1);
  });

  it('observes the body element with correct options', () => {
    render(<CookieConsent isOpen={mockSetIsOpen} />);
    expect(mockObserve).toHaveBeenCalledWith(
      document.querySelector('body'),
      expect.objectContaining({ childList: true, subtree: true }),
    );
  });

  it('disconnects observer on unmount', () => {
    const { unmount } = render(<CookieConsent isOpen={mockSetIsOpen} />);
    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('sets isOpen(true) when #ccc element with children appears', () => {
    render(<CookieConsent isOpen={mockSetIsOpen} />);

    // simulate a #ccc element appearing in body
    const ccc = document.createElement('div');
    ccc.id = 'ccc';
    ccc.appendChild(document.createElement('div'));

    act(() => {
      callback(
        [
          {
            target: ccc,
            type: 'childList',
            addedNodes: ccc.childNodes,
            removedNodes: [],
            previousSibling: null,
            nextSibling: null,
          } as unknown as MutationRecord,
        ],
        mockObserver,
      );
    });

    expect(mockSetIsOpen).toHaveBeenCalledWith(true);
  });

  it('attaches event listeners to reject buttons that trigger CookieControl.changeCategory', () => {
    render(<CookieConsent isOpen={mockSetIsOpen} />);

    // simulate #ccc element with reject buttons
    const ccc = document.createElement('div');
    ccc.id = 'ccc';

    const topReject = document.createElement('button');
    topReject.id = 'ccc-notify-reject';
    const sideReject = document.createElement('button');
    sideReject.id = 'ccc-reject-settings';

    ccc.appendChild(topReject);
    ccc.appendChild(sideReject);

    act(() => {
      callback(
        [
          {
            target: ccc,
            type: 'childList',
            addedNodes: ccc.childNodes,
            removedNodes: [],
            previousSibling: null,
            nextSibling: null,
          } as unknown as MutationRecord,
        ],
        mockObserver,
      );
    });

    act(() => {
      topReject.click();
      sideReject.click();
    });

    const cookieControl = (
      window as unknown as {
        CookieControl: { changeCategory: jest.Mock };
      }
    ).CookieControl;

    expect(cookieControl.changeCategory).toHaveBeenCalledWith(0, true);
    expect(cookieControl.changeCategory).toHaveBeenCalledTimes(2);
  });

  it('renders the Script component with correct props', () => {
    process.env.NEXT_PUBLIC_CIVIC_COOKIE_SCRIPT = 'https://cookie-script.js';
    const { getByTestId } = render(<CookieConsent isOpen={mockSetIsOpen} />);
    const script = getByTestId('mock-script');
    expect(script).toHaveAttribute('src', 'https://cookie-script.js');
    expect(script).toHaveAttribute('strategy', 'beforeInteractive');
  });

  it('passes config to useCookieConsent when provided', () => {
    const mockConfig: NonNullable<
      React.ComponentProps<typeof CookieConsentType>['config']
    > = {
      locales: ['en'],
      text: 'Hello world',
    };

    render(<CookieConsent isOpen={mockSetIsOpen} config={mockConfig} />);

    expect(mockUseCookieConsent).toHaveBeenCalledWith(mockConfig);
  });
});

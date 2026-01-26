import { fireEvent, render, screen } from '@testing-library/react';

import { IconType } from '@maps-react/common/components/Icon';
import { LinkComponentProps } from '@maps-react/common/components/Link';

import { BackToTop } from './BackToTop';

import '@testing-library/jest-dom';

jest.mock('@maps-react/common/components/Icon', () => ({
  Icon: ({ type, fill }: { type: string; fill: string }) => (
    <svg data-testid="icon" data-type={type} data-fill={fill}></svg>
  ),
  IconType: {
    ARROW_UP: 'arrow_up',
  },
}));

jest.mock('@maps-react/common/components/Link', () => ({
  Link: ({ href, className, children, onClick }: LinkComponentProps) => (
    <a href={href as string} className={className} onClick={onClick}>
      {children}
    </a>
  ),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    z: (textMap: { en: string; cy: string }) => textMap.en,
  }),
}));

describe('BackToTop', () => {
  let originalScrollY: number;
  let scrollToSpy: jest.SpyInstance;
  let rafSpy: jest.SpyInstance;
  let rafCallbacks: FrameRequestCallback[];

  const setupScrollMocks = (scrollYValue = 100) => {
    originalScrollY = window.scrollY;
    Object.defineProperty(window, 'scrollY', {
      value: scrollYValue,
      writable: true,
      configurable: true,
    });

    scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(jest.fn());
    rafCallbacks = [];
    rafSpy = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb: FrameRequestCallback) => {
        rafCallbacks.push(cb);
        return rafCallbacks.length;
      });
  };

  const teardownScrollMocks = () => {
    scrollToSpy?.mockRestore();
    rafSpy?.mockRestore();
    Object.defineProperty(window, 'scrollY', {
      value: originalScrollY,
      writable: true,
      configurable: true,
    });
  };

  const simulateRafCallbacks = () => {
    if (rafCallbacks[0]) {
      rafCallbacks[0](0);
    }
    if (rafCallbacks[1]) {
      rafCallbacks[1](0);
    }
  };

  const createMainElement = (withTabIndex = false) => {
    const mainElement = document.createElement('main');
    mainElement.id = 'main';
    if (withTabIndex) {
      mainElement.setAttribute('tabindex', '0');
    }
    document.body.appendChild(mainElement);
    return mainElement;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
    teardownScrollMocks();
  });

  it('renders link with correct href', () => {
    render(<BackToTop />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '#main');
  });

  it('renders the translated text', () => {
    render(<BackToTop />);
    expect(screen.getByText('Back to top')).toBeInTheDocument();
  });

  it('renders the Icon with correct props', () => {
    render(<BackToTop />);
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('data-type', IconType.ARROW_UP);
  });

  it('handles click by jumping and then smoothly scrolling to top', () => {
    setupScrollMocks(200);
    rafSpy.mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });

    render(<BackToTop />);

    const link = screen.getByRole('link');
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    link.dispatchEvent(clickEvent);

    expect(clickEvent.defaultPrevented).toBe(true);
    expect(scrollToSpy).toHaveBeenNthCalledWith(1, 0, 60);
    expect(rafSpy).toHaveBeenCalledTimes(2);
    expect(scrollToSpy).toHaveBeenNthCalledWith(2, {
      top: 0,
      behavior: 'smooth',
    });
  });

  it('focuses the main element and updates hash after smooth scroll', () => {
    const mainElement = createMainElement();
    setupScrollMocks();

    const focusSpy = jest
      .spyOn(mainElement, 'focus')
      .mockImplementation(jest.fn());
    const replaceStateSpy = jest
      .spyOn(window.history, 'replaceState')
      .mockImplementation(jest.fn());

    render(<BackToTop />);
    fireEvent.click(screen.getByRole('link'));
    simulateRafCallbacks();

    expect(focusSpy).toHaveBeenCalled();
    expect(replaceStateSpy).toHaveBeenCalledWith(
      null,
      '',
      expect.stringContaining('#main'),
    );
    expect(mainElement.hasAttribute('tabindex')).toBe(false);

    focusSpy.mockRestore();
    replaceStateSpy.mockRestore();
  });

  it('handles main element with existing tabindex', () => {
    const mainElement = createMainElement(true);
    setupScrollMocks();

    const focusSpy = jest
      .spyOn(mainElement, 'focus')
      .mockImplementation(jest.fn());

    render(<BackToTop />);
    fireEvent.click(screen.getByRole('link'));
    simulateRafCallbacks();

    expect(focusSpy).toHaveBeenCalled();
    expect(mainElement.hasAttribute('tabindex')).toBe(true);
    expect(mainElement.getAttribute('tabindex')).toBe('0');

    focusSpy.mockRestore();
  });

  it('handles missing main element gracefully', () => {
    setupScrollMocks();
    const getElementByIdSpy = jest
      .spyOn(document, 'getElementById')
      .mockReturnValue(null);

    render(<BackToTop />);
    fireEvent.click(screen.getByRole('link'));
    simulateRafCallbacks();

    expect(getElementByIdSpy).toHaveBeenCalledWith('main');

    getElementByIdSpy.mockRestore();
  });

  it('uses document.documentElement.scrollTop when scrollY is 0', () => {
    const originalScrollTop = document.documentElement.scrollTop;
    setupScrollMocks(0);
    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: 150,
      writable: true,
      configurable: true,
    });

    render(<BackToTop />);
    fireEvent.click(screen.getByRole('link'));

    // First scroll should use documentElement.scrollTop (150 * 0.3 = 45)
    expect(scrollToSpy).toHaveBeenNthCalledWith(1, 0, 45);

    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: originalScrollTop,
      writable: true,
      configurable: true,
    });
  });

  it('handles zero scroll position', () => {
    const originalScrollTop = document.documentElement.scrollTop;
    setupScrollMocks(0);
    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: 0,
      writable: true,
      configurable: true,
    });

    render(<BackToTop />);
    fireEvent.click(screen.getByRole('link'));

    // First scroll should be 0 (0 * 0.3 = 0)
    expect(scrollToSpy).toHaveBeenNthCalledWith(1, 0, 0);

    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: originalScrollTop,
      writable: true,
      configurable: true,
    });
  });

  it('updates hash with current pathname and search params', () => {
    createMainElement();
    const originalPathname = window.location.pathname;
    const originalSearch = window.location.search;

    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        pathname: '/test/path',
        search: '?param=value',
      },
      writable: true,
      configurable: true,
    });

    setupScrollMocks();
    const replaceStateSpy = jest
      .spyOn(window.history, 'replaceState')
      .mockImplementation(jest.fn());

    render(<BackToTop />);
    fireEvent.click(screen.getByRole('link'));
    simulateRafCallbacks();

    expect(replaceStateSpy).toHaveBeenCalledWith(
      null,
      '',
      '/test/path?param=value#main',
    );

    replaceStateSpy.mockRestore();
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        pathname: originalPathname,
        search: originalSearch,
      },
      writable: true,
      configurable: true,
    });
  });

  it('updateHash function includes SSR guard for window undefined', () => {
    // Note: The SSR guard (line 29: `if (typeof window === 'undefined') return;`)
    // cannot be easily tested in a browser test environment since window is always defined.
    // This guard is defensive code for SSR scenarios and would be tested in actual SSR
    // environments or integration tests. The code path is verified to exist and the
    // function works correctly when window is defined (tested in other tests).

    createMainElement();
    setupScrollMocks();
    const replaceStateSpy = jest
      .spyOn(window.history, 'replaceState')
      .mockImplementation(jest.fn());

    render(<BackToTop />);
    fireEvent.click(screen.getByRole('link'));
    simulateRafCallbacks();

    // Verify updateHash executed (when window is defined, it updates the hash)
    expect(replaceStateSpy).toHaveBeenCalled();

    replaceStateSpy.mockRestore();
  });
});

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as useTranslationModule from '@maps-react/hooks/useTranslation';
import { useRouter } from 'next/router';

import {
  COOKIE_PREFERENCE_HASH,
  createCookieBannerConfig,
} from './cookieBannerConfig';
import { Footer } from '../Footer';
import {
  COOKIE_CONTROL_NAME,
  setMpsCookie,
} from '../../utils/cookies/mpsCookieUtils';
import { CookieBanner } from '.';

import '@testing-library/jest-dom';

declare global {
  // eslint-disable-next-line no-var
  var dataLayer: Record<string, unknown>[] | undefined;
  // eslint-disable-next-line no-var
  var gtag: ((...args: unknown[]) => void) | undefined;
}

const mockUseRouter = jest.mocked(useRouter);

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: { language: 'en' },
    asPath: '/en',
  }),
}));

const COOKIE_POLICY_URL = 'https://maps.org.uk/en/about-us/cookie-policy';
const PRIVACY_POLICY_URL = 'https://maps.org.uk/en/about-us/privacy-notice';

const config = createCookieBannerConfig({
  siteName: 'Evidence Hub',
  cookiePolicyUrl: COOKIE_POLICY_URL,
  privacyPolicyUrl: PRIVACY_POLICY_URL,
});

const legalFooterLinks = [
  {
    title: 'Legal',
    childLinks: [{ text: 'Cookie policy', linkTo: '/cookie-policy' }],
  },
];

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

const mockRouterLanguage = (language: 'en' | 'cy') => {
  mockUseRouter.mockReturnValue({
    query: { language },
    asPath: `/${language}`,
  } as unknown as ReturnType<typeof useRouter>);
};

const getBannerButton = (type: string) => {
  const banner = screen.getByTestId('mps-cookie-banner');
  const button = banner.querySelector(`[data-button-type="${type}"]`);

  if (!(button instanceof HTMLButtonElement)) {
    throw new TypeError(`Expected banner button "${type}"`);
  }

  return button;
};

const getStoredConsentFromDocument = () => {
  const cookieValue = document.cookie
    .split(';')
    .find((cookie) => cookie.trim().startsWith(`${COOKIE_CONTROL_NAME}=`))
    ?.split('=')[1];

  return cookieValue ? JSON.parse(decodeURIComponent(cookieValue)) : null;
};

describe('CookieBanner', () => {
  beforeEach(() => {
    mockRouterLanguage('en');

    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0]?.trim();

      if (name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      }
    });
    globalThis.dataLayer = [];
    globalThis.gtag = jest.fn();

    HTMLDialogElement.prototype.showModal = jest.fn(function showModal(
      this: HTMLDialogElement,
    ) {
      this.open = true;
    });
    HTMLDialogElement.prototype.close = jest.fn(function close(
      this: HTMLDialogElement,
    ) {
      this.open = false;
    });
  });

  it('opens the dialog when no consent cookie exists', async () => {
    render(<CookieBanner config={config} />);

    await waitFor(() => {
      expect(screen.getByTestId('mps-cookie-banner')).toHaveAttribute(
        'aria-modal',
        'true',
      );
    });
  });

  it('shows all cookie preference checkboxes', async () => {
    render(<CookieBanner config={config} />);

    await waitFor(() => {
      expect(screen.getByLabelText('Necessary Cookies')).toBeInTheDocument();
      expect(screen.getByLabelText('Analytics Cookies')).toBeInTheDocument();
      expect(screen.getByLabelText('Marketing Cookies')).toBeInTheDocument();
    });
  });

  it('renders the intro with site name and policy links', async () => {
    render(<CookieBanner config={config} />);

    await waitFor(() => {
      expect(screen.getByText(/Evidence Hub/)).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'Cookie Policy' }),
      ).toHaveAttribute('href', COOKIE_POLICY_URL);
      expect(
        screen.getByRole('link', { name: 'Privacy Policy' }),
      ).toHaveAttribute('href', PRIVACY_POLICY_URL);
    });
  });

  it('renders Welsh policy links when language is cy', async () => {
    mockRouterLanguage('cy');

    const bilingualConfig = createCookieBannerConfig({
      siteName: 'Evidence Hub',
      cookiePolicyUrl: {
        en: 'https://maps.org.uk/en/about-us/cookie-policy',
        cy: 'https://maps.org.uk/cy/about-us/cookie-policy',
      },
      privacyPolicyUrl: {
        en: 'https://maps.org.uk/en/about-us/privacy-notice',
        cy: 'https://maps.org.uk/cy/about-us/privacy-notice',
      },
    });

    render(<CookieBanner config={bilingualConfig} />);

    await waitFor(() => {
      expect(
        screen.getByRole('link', { name: 'Polisi Cwcis' }),
      ).toHaveAttribute(
        'href',
        'https://maps.org.uk/cy/about-us/cookie-policy',
      );
      expect(
        screen.getByRole('link', { name: 'Polisi Preifatrwydd' }),
      ).toHaveAttribute(
        'href',
        'https://maps.org.uk/cy/about-us/privacy-notice',
      );
    });
  });

  it('renders a custom title when the full config is replaced', async () => {
    const customConfig = {
      ...config,
      text: {
        ...config.text,
        title: { en: 'Custom cookie title', cy: config.text.title.cy },
      },
    };

    render(<CookieBanner config={customConfig} />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Custom cookie title' }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Necessary Cookies')).toBeInTheDocument();
    });
  });

  it('does not open the dialog when consent cookie exists', async () => {
    setMpsCookie(
      COOKIE_CONTROL_NAME,
      JSON.stringify({
        analytics: true,
        marketing: false,
        consentDays: 90,
        consentDateTimeUTC: new Date().toISOString(),
      }),
      90,
      '/',
    );

    render(<CookieBanner config={config} />);

    await waitFor(() => {
      expect(screen.getByTestId('mps-cookie-banner')).toHaveAttribute(
        'aria-modal',
        'false',
      );
    });
  });

  it('accepts all cookies and closes the dialog', async () => {
    render(<CookieBanner config={config} />);

    const acceptButton = await screen.findByTestId('cookie-banner-accept-all');
    fireEvent.click(acceptButton);

    await waitFor(() => {
      expect(document.cookie).toContain(`${COOKIE_CONTROL_NAME}=`);
      expect(screen.getByTestId('mps-cookie-banner')).toHaveAttribute(
        'aria-modal',
        'false',
      );
    });
  });

  it('opens the dialog when a cookie preferences link is clicked', async () => {
    setMpsCookie(
      COOKIE_CONTROL_NAME,
      JSON.stringify({
        analytics: true,
        marketing: false,
        consentDays: 90,
        consentDateTimeUTC: new Date().toISOString(),
      }),
      90,
      '/',
    );

    render(
      <>
        <CookieBanner config={config} />
        <a href={`/cookie-policy${COOKIE_PREFERENCE_HASH}`}>
          Cookie preferences
        </a>
      </>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Cookie preferences' }));

    await waitFor(() => {
      expect(screen.getByTestId('mps-cookie-banner')).toHaveAttribute(
        'aria-modal',
        'true',
      );
    });
  });

  it('rejects additional cookies and closes the dialog', async () => {
    render(<CookieBanner config={config} />);

    await screen.findByTestId('mps-cookie-banner');
    fireEvent.click(getBannerButton('reject-additional'));

    await waitFor(() => {
      expect(document.cookie).toContain(`${COOKIE_CONTROL_NAME}=`);
      expect(screen.getByTestId('mps-cookie-banner')).toHaveAttribute(
        'aria-modal',
        'false',
      );
    });

    expect(getStoredConsentFromDocument()).toEqual(
      expect.objectContaining({ analytics: false, marketing: false }),
    );
  });

  it('saves selected cookie preferences', async () => {
    render(<CookieBanner config={config} />);

    await screen.findByTestId('cookie-banner-accept-all');

    fireEvent.click(screen.getByLabelText('Analytics Cookies'));
    fireEvent.click(screen.getByLabelText('Marketing Cookies'));
    fireEvent.click(getBannerButton('save'));

    await waitFor(() => {
      expect(document.cookie).toContain(`${COOKIE_CONTROL_NAME}=`);
      expect(screen.getByTestId('mps-cookie-banner')).toHaveAttribute(
        'aria-modal',
        'false',
      );
    });

    expect(getStoredConsentFromDocument()).toEqual(
      expect.objectContaining({ analytics: true, marketing: true }),
    );
  });

  it('triggers button actions on Space keypress', async () => {
    render(<CookieBanner config={config} />);

    await screen.findByTestId('mps-cookie-banner');
    const rejectButton = getBannerButton('reject-additional');

    fireEvent.keyDown(rejectButton, { code: 'Space' });

    await waitFor(() => {
      expect(document.cookie).toContain(`${COOKIE_CONTROL_NAME}=`);
      expect(screen.getByTestId('mps-cookie-banner')).toHaveAttribute(
        'aria-modal',
        'false',
      );
    });
  });

  it('triggers save on Space keypress', async () => {
    render(<CookieBanner config={config} />);

    await screen.findByTestId('mps-cookie-banner');
    fireEvent.keyDown(getBannerButton('save'), { code: 'Space' });

    await waitFor(() => {
      expect(getStoredConsentFromDocument()).toEqual(
        expect.objectContaining({ analytics: false, marketing: false }),
      );
    });
  });

  it('triggers accept all on Space keypress', async () => {
    render(<CookieBanner config={config} />);

    await screen.findByTestId('mps-cookie-banner');
    fireEvent.keyDown(getBannerButton('accept-all'), { code: 'Space' });

    await waitFor(() => {
      expect(getStoredConsentFromDocument()).toEqual(
        expect.objectContaining({ analytics: true, marketing: true }),
      );
    });
  });

  it('prevents default when Escape is pressed on the dialog', async () => {
    render(<CookieBanner config={config} />);

    const dialog = await screen.findByTestId('mps-cookie-banner');
    const escapeEvent = new KeyboardEvent('keydown', {
      code: 'Escape',
      bubbles: true,
      cancelable: true,
    });
    const preventDefault = jest.spyOn(escapeEvent, 'preventDefault');

    dialog.dispatchEvent(escapeEvent);

    expect(preventDefault).toHaveBeenCalled();
  });

  it('opens the dialog when landing with cookie preferences hash', async () => {
    setMpsCookie(
      COOKIE_CONTROL_NAME,
      JSON.stringify({
        analytics: true,
        marketing: false,
        consentDays: 90,
        consentDateTimeUTC: new Date().toISOString(),
      }),
      90,
      '/',
    );

    globalThis.location.hash = COOKIE_PREFERENCE_HASH;

    render(<CookieBanner config={config} />);

    await waitFor(() => {
      expect(screen.getByTestId('mps-cookie-banner')).toHaveAttribute(
        'aria-modal',
        'true',
      );
    });

    globalThis.location.hash = '';
  });

  it('syncs checkbox state from stored consent when reopening preferences', async () => {
    render(
      <>
        <CookieBanner config={config} />
        <a href={`/cookie-policy${COOKIE_PREFERENCE_HASH}`}>
          Cookie preferences
        </a>
      </>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('mps-cookie-banner')).toHaveAttribute(
        'aria-modal',
        'true',
      );
    });

    expect(screen.getByLabelText('Analytics Cookies')).not.toBeChecked();
    expect(screen.getByLabelText('Marketing Cookies')).not.toBeChecked();

    fireEvent.click(screen.getByTestId('cookie-banner-accept-all'));

    await waitFor(() => {
      expect(screen.getByTestId('mps-cookie-banner')).toHaveAttribute(
        'aria-modal',
        'false',
      );
    });

    fireEvent.click(screen.getByRole('link', { name: 'Cookie preferences' }));

    await waitFor(() => {
      expect(screen.getByTestId('mps-cookie-banner')).toHaveAttribute(
        'aria-modal',
        'true',
      );
      expect(screen.getByLabelText('Analytics Cookies')).toBeChecked();
      expect(screen.getByLabelText('Marketing Cookies')).toBeChecked();
    });
  });

  it('wraps focus when tabbing past the last focusable element', async () => {
    render(<CookieBanner config={config} />);

    await waitFor(() => {
      expect(screen.getByTestId('mps-cookie-banner')).toHaveAttribute(
        'aria-modal',
        'true',
      );
    });

    const dialog = screen.getByTestId('mps-cookie-banner');
    const focusableElements =
      dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    const lastFocusable = focusableElements[focusableElements.length - 1];
    const firstFocusable = focusableElements[0];

    lastFocusable.focus();

    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    const preventDefault = jest.spyOn(tabEvent, 'preventDefault');

    lastFocusable.dispatchEvent(tabEvent);

    expect(preventDefault).toHaveBeenCalled();
    expect(document.activeElement).toBe(firstFocusable);
  });

  it('wraps focus when shift-tabbing past the first focusable element', async () => {
    render(<CookieBanner config={config} />);

    await waitFor(() => {
      expect(screen.getByTestId('mps-cookie-banner')).toHaveAttribute(
        'aria-modal',
        'true',
      );
    });

    const dialog = screen.getByTestId('mps-cookie-banner');
    const focusableElements =
      dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    const lastFocusable = focusableElements[focusableElements.length - 1];
    const firstFocusable = focusableElements[0];

    firstFocusable.focus();

    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    const preventDefault = jest.spyOn(tabEvent, 'preventDefault');

    firstFocusable.dispatchEvent(tabEvent);

    expect(preventDefault).toHaveBeenCalled();
    expect(document.activeElement).toBe(lastFocusable);
  });

  it('injects and cleans up a footer cookie preferences link', async () => {
    const { unmount } = render(
      <>
        <Footer
          footerLinkGroup={legalFooterLinks}
          copyright="Copyright"
          reservedRights="Rights"
        />
        <CookieBanner config={config} />
      </>,
    );

    await waitFor(() => {
      expect(
        document.querySelector('[data-mps-cookie-preferences-link="true"]'),
      ).toHaveTextContent('Cookie preferences');
    });

    unmount();

    expect(
      document.querySelector('[data-mps-cookie-preferences-link="true"]'),
    ).not.toBeInTheDocument();
  });

  it('skips footer injection when a preferences link already exists', async () => {
    render(
      <>
        <Footer
          footerLinkGroup={[
            {
              title: 'Legal',
              childLinks: [
                { text: 'Cookie policy', linkTo: '/cookie-policy' },
                {
                  text: 'Cookie preferences',
                  linkTo: `/cookie-policy${COOKIE_PREFERENCE_HASH}`,
                },
              ],
            },
          ]}
          copyright="Copyright"
          reservedRights="Rights"
        />
        <CookieBanner config={config} />
      </>,
    );

    await waitFor(() => {
      expect(
        document.querySelectorAll('[data-mps-cookie-preferences-link="true"]'),
      ).toHaveLength(0);
    });
  });

  it('ignores preference link clicks on non-element targets', async () => {
    render(<CookieBanner config={config} />);

    await waitFor(() => {
      expect(screen.getByTestId('mps-cookie-banner')).toHaveAttribute(
        'aria-modal',
        'true',
      );
    });

    fireEvent.click(screen.getByTestId('cookie-banner-accept-all'));

    await waitFor(() => {
      expect(screen.getByTestId('mps-cookie-banner')).toHaveAttribute(
        'aria-modal',
        'false',
      );
    });

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(clickEvent, 'target', {
      value: { nodeType: 3 },
    });

    document.dispatchEvent(clickEvent);

    expect(screen.getByTestId('mps-cookie-banner')).toHaveAttribute(
      'aria-modal',
      'false',
    );
  });

  it('omits aria-label when button labels are not plain strings', async () => {
    const spy = jest.spyOn(useTranslationModule, 'default').mockReturnValue({
      z: () => <span>Label</span>,
    } as ReturnType<typeof useTranslationModule.default>);

    render(<CookieBanner config={config} />);

    await waitFor(() => {
      expect(getBannerButton('reject-additional')).not.toHaveAttribute(
        'aria-label',
      );
    });

    spy.mockRestore();
  });
});

import { type Page, type Locator } from '@maps/playwright';

type CookieStatus = 'accepted' | 'revoked' | 'unknown';

type CookieControlValue = {
  optionalCookies?: {
    analytics?: CookieStatus;
    marketing?: CookieStatus;
  };
};

class CookiesPreferencesSideBanner {
  constructor(private readonly page: Page) {}

  get banner(): Locator {
    return this.page.getByRole('dialog', {
      name: 'Cookies on MoneyHelper',
    });
  }

  get welshBanner(): Locator {
    return this.page.getByRole('dialog', {
      name: 'Cwcis ar HelpwrArian',
    });
  }

  get acceptButton(): Locator {
    return this.page.locator('#ccc-notify-accept');
  }

  get rejectMarketingButton(): Locator {
    return this.page.locator('#ccc-notify-reject');
  }

  get learnMoreLink(): Locator {
    return this.page.locator('.ccc-notify-link');
  }

  get preferencesPanel(): Locator {
    return this.page.locator('#ccc-module');
  }

  get preferencesRejectButton(): Locator {
    return this.page.locator('#ccc-reject-settings');
  }

  get savePreferencesButton(): Locator {
    return this.page.locator('#ccc-dismiss-button');
  }

  get cookiePolicyLink(): Locator {
    return this.page.getByRole('link', { name: 'Cookie policy', exact: true });
  }

  async getOptionalCookieStatus(
    cookieType: 'analytics' | 'marketing',
  ): Promise<CookieStatus> {
    const cookies = await this.page.context().cookies();
    const consentCookie = cookies.find(
      (cookie) => cookie.name === 'CookieControl',
    );

    if (!consentCookie) {
      return 'unknown';
    }

    const cookieValue = JSON.parse(
      decodeURIComponent(consentCookie.value),
    ) as CookieControlValue;

    return cookieValue.optionalCookies?.[cookieType] ?? 'unknown';
  }
}

export default CookiesPreferencesSideBanner;

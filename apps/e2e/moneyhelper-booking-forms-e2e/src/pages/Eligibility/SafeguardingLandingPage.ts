import { FlowName } from '@app/lib/constants';
import type { Locator } from '@mhbf-e2e/lib/test.lib';

import { BasePage } from '../BasePage';

export class SafeguardingLandingPage extends BasePage {
  get heading(): Locator {
    return this.page.getByRole('heading', {
      level: 1,
      name: 'Pension Safeguarding Guidance appointment',
      exact: true,
    });
  }

  get bookAppointmentButton(): Locator {
    return this.page.getByRole('button', {
      name: 'Book your free appointment',
      exact: true,
    });
  }

  get findAppointmentLink(): Locator {
    return this.page.getByRole('link', {
      name: 'Find your appointment',
      exact: true,
    });
  }

  get privacyNoticeLink(): Locator {
    return this.page.getByRole('link', {
      name: 'Privacy Notice (opens in a new window)',
      exact: true,
    });
  }

  get appointmentHeading(): Locator {
    return this.heading;
  }

  // --- Page Actions --- //

  /**
   * Starts the Pension Safeguarding flow at its entry URL.
   */
  async goTo(lang = 'en'): Promise<void> {
    await this.page.goto(`/${lang}?aa=${FlowName.PENSION_SAFE_GUARDING}`);
  }
}

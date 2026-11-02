import { StepName } from '@app/lib/constants';
import { expect, type Page } from '@mhbf-e2e/lib/test.lib';

import { BasePage } from './BasePage';

type Cookie = Awaited<
  ReturnType<ReturnType<Page['context']>['cookies']>
>[number];

const cookieName = 'fsid';

/**
 * POM class for the Error page.
 */
export class ErrorPage extends BasePage {
  // --- Locators --- //

  get errorTitle() {
    return this.pageTitle(StepName.ERROR);
  }

  // --- Actions & Helpers --- //

  async gotoErrorPage(param = '') {
    await this.page.goto(`/en/${StepName.ERROR}${param}`);
  }

  async getFsidCookie(): Promise<Cookie | undefined> {
    const cookies = await this.page.context().cookies();
    return cookies.find((c) => c.name === cookieName);
  }

  /**
   * Asserts navigation to the error page, checks fsid cookie is unset,
   * and verifies the error title is visible.
   */
  async assertErrorPageAndNoFsid(param = '') {
    await this.page.waitForURL(`/en/${StepName.ERROR}${param}`, {
      timeout: 20000,
    });

    const fsidCookie = await this.getFsidCookie();
    expect(fsidCookie).toBeUndefined();
    await expect(this.errorTitle).toBeVisible();
  }
}

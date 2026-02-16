import { BasePage } from './BasePage';

/**
 * POM class for the name page, containing methods specific to this page and its interactions
 */
export class NamePage extends BasePage {
  // --- Navigation methods --- //

  /**
   * Navigates to the name step by selecting the given option type and handling the optional about page
   * @param optionType - The radio option to select
   */
  async goToName(optionType: string) {
    // Select the relevant radio option
    await this.clickRadio(optionType);
    await this.submitForm();

    // Wait for either an about page or the name page to load
    // See `routes/routeFlow.ts` in the app showing different flows based on the option selected
    await this.page.waitForURL(/\/en\/about[^/]*|\/en\/name/, {
      timeout: 20000,
    });
    // If an about page appears, submit it to navigate to the name page
    if (/\/en\/about[^/]*/.exec(this.page.url())) {
      await this.submitForm();
      await this.page.waitForURL(/\/en\/name/, { timeout: 20000 });
    }
  }
}

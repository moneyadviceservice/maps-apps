import { Page } from '@maps/playwright';

class YourPensionsTimeline {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async pageLoads() {
    await this.page.getByTestId('timeline-key').waitFor();
  }

  async getPageTitle() {
    return this.page.getByTestId('page-title').innerText();
  }

  async getTimelineHeading() {
    return this.page.getByRole('heading', { name: 'Timeline' }).innerText();
  }

  async getFirstParagraph() {
    return (
      await this.page
        .locator('p')
        .filter({
          hasText:
            'The timeline shows how your total estimated pension income could change over time',
        })
        .innerText()
    )
      .replaceAll(/\s+/g, ' ')
      .trim();
  }

  async getSecondParagraph() {
    return this.page
      .locator('p')
      .filter({
        hasText:
          'Your actual income will depend on how and when you take your pensions.',
      })
      .innerText();
  }

  async getKeyHeading() {
    return this.page.getByTestId('timeline-key').locator('h3').innerText();
  }

  async getKeyItems() {
    const keyItemsArray = await this.page
      .getByTestId('timeline-key')
      .locator('ul > li')
      .allTextContents();

    return keyItemsArray.join(' ');
  }

  async getTimelineExplainer() {
    return this.page.getByTestId('timeline-toggle-intro').textContent();
  }

  async getLegacyOptionText() {
    return this.page
      .getByTestId('timeline-toggle-option-legacy-label')
      .textContent();
  }

  async getAlternativeOptionText() {
    return this.page
      .getByTestId('timeline-toggle-option-alternative-label')
      .textContent();
  }

  async clickLegacyOption(page: Page) {
    await page.getByTestId('timeline-toggle-option-legacy-label').click();
    await page.waitForURL('**/your-pensions-timeline?income=legacy');
  }

  async verifyBackLinkAlternativeOption(page: Page) {
    await page.getByText('View pensions (2)').click();
    await page.getByText('Hide pensions (2)').waitFor();
    await page.getByTestId('details-link').first().click();
    await page.waitForURL('**/pension-details/your-pension-summary');
    await page.getByTestId('back').click();
    await page.waitForURL('**/your-pensions-timeline?income=alternative');
  }

  async verifyBackLinkLegacyOption(page: Page) {
    await page.getByText('View pensions (2)').click();
    await page.getByText('Hide pensions (2)').waitFor();
    await page.getByTestId('details-link').first().click();
    await page.waitForURL('**/pension-details/your-pension-summary');
    await page.getByTestId('back').click();
    await page.waitForURL('**/your-pensions-timeline?income=legacy');
  }

  async clickAlternativeOption(page: Page) {
    await page.getByTestId('timeline-toggle-option-alternative-label').click();
    await page.waitForURL('**/your-pensions-timeline?income=alternative');
  }

  async getAboutTheseValuesHeading() {
    return this.page
      .getByTestId('summary-block-title')
      .filter({ hasText: 'About these values' })
      .innerText();
  }

  async getAboutTheseValuesParagraphOne() {
    return this.page
      .getByTestId('paragraph')
      .filter({
        hasText:
          'These values are based on the pensions we have estimated incomes for so far',
      })
      .textContent();
  }

  async getAboutTheseValuesParagraphTwo() {
    return this.page
      .getByTestId('paragraph')
      .filter({ hasText: 'All values are shown before tax' })
      .textContent();
  }

  async getTooltipText() {
    const tooltipContainer = this.page.getByTestId('tooltip-content');
    const fullText = await tooltipContainer.textContent();

    if (fullText) {
      return fullText.replaceAll('Close', '').trim().replaceAll(/\s+/g, ' ');
    }
    return '';
  }
}

export default YourPensionsTimeline;

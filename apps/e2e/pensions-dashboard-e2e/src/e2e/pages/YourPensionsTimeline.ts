import { Page } from '@playwright/test';

class YourPensionsTimeline {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
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
    return this.page.getByTestId('timeline-key').locator('h4').innerText();
  }

  async getKeyItems() {
    const keyItemsArray = await this.page
      .getByTestId('timeline-key')
      .locator('ul > li')
      .allTextContents();

    return keyItemsArray.join(' ');
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

  async clickTooltip() {
    const tooltipInputLocator = this.page.getByTestId('tooltip-input');
    const tooltipInputId = await tooltipInputLocator.getAttribute('id');
    await this.page.locator(`label[for="${tooltipInputId}"]`).click();
  }
}

export default YourPensionsTimeline;

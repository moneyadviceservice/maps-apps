import { BarChartData } from 'src/e2e/types/barChartScenario.types';
import { type Page } from '@maps/playwright';

type BarPosition = 'left' | 'right';

class BarChart {
  static readonly MaxBarHeightInPixels = 135;
  static readonly MinBarHeightInPixels = 1;

  // Bar labels are the text above the bar,
  // i.e $4,000 a year £333 a month or 'Unavailable'
  private barLabelTestIds: Record<BarPosition, string> = {
    left: 'bar-label-0',
    right: 'bar-label-1',
  };

  // Bar legends are the text under the bar.
  // i.e. Latest Value 2025 or 'Unavailable'
  private barLegendTestIds: Record<BarPosition, string> = {
    left: 'bar-legend-0',
    right: 'bar-legend-1',
  };

  // These are the ID's for the actual bars themselves.
  private barTestIds: Record<BarPosition, string> = {
    left: 'bar-0',
    right: 'bar-1',
  };

  constructor(private readonly page: Page) {}

  /**
   * Returns the text of the bar chart header (inside the bounds of the bar chart)
   */
  async getBarHeaderText() {
    return this.page.getByTestId('bar-heading').innerText();
  }

  /**
   * Given a bar position, returns the text from the bars legend (below the bar)
   */
  async getBarLegendText(barPosition: BarPosition) {
    const selector = this.barLegendTestIds[barPosition];
    return this.page.getByTestId(selector).innerText();
  }

  /**
   * Given a bar position, returns the text from the bars label (above the bar)
   */
  async getBarLabelText(barPosition: BarPosition) {
    const selector = this.barLabelTestIds[barPosition];
    return this.page.getByTestId(selector).innerText();
  }

  /**
   * Given a bar position, returns height in pixels as string, example: "1px"
   */
  async getBarHeight(barPosition: BarPosition) {
    const selector = this.barTestIds[barPosition];
    return this.page
      .getByTestId(selector)
      .evaluate((el: HTMLElement) => el.offsetHeight);
  }

  /**
   * Given a bar position, returns the tailwind class name that sets the background colour.
   */
  async getBarColour(barPosition: BarPosition) {
    const selector = this.barTestIds[barPosition];
    const barClassList = await this.page
      .getByTestId(selector)
      .getAttribute('class');

    const tailwindBackgroundClass = barClassList
      .split(' ')
      .find((className) => className.startsWith('bg-'));

    return tailwindBackgroundClass;
  }

  /**
   * Given a pension bar chart object, calculate the expected left bar height.
   * Returns the expected pixel height of the bar in pixels, including the border.
   */
  calculateLeftBarHeight(chartData: BarChartData): number {
    // Keep these guard clauses in this order.
    if (!chartData.latestValues) return 1; // If there's no latest value, it shouldn't have any height.
    if (!chartData.estimateAtRetirement) return 135; // If there is no estimated retirement value, it's full height.

    const parseCurrencyToNumber = (str: string) =>
      Number(str.replace(/£|,/g, ''));

    const total = parseCurrencyToNumber(chartData.estimateAtRetirement.yearly);
    const portion = parseCurrencyToNumber(chartData.latestValues.yearly);

    const percentageOfRetirementValue =
      (portion / total) * BarChart.MaxBarHeightInPixels;

    return percentageOfRetirementValue;
  }
}

export default BarChart;

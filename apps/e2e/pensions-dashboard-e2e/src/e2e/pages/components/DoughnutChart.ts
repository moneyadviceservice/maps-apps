import { type Page } from '@maps/playwright';

type DoughnutPosition = 'left' | 'right';

type DoughnutFilledStatus = 'filled' | 'unfilled';

type Vector2 = [number, number]; // first is x, second is y

interface DoughnutRings {
  inner: string;
  outer: string;
  path: string;
}

class DoughnutChart {
  static readonly MaxBarHeightInPixels = 135;
  static readonly MinBarHeightInPixels = 1;

  // doughnut labels are the text above the doughnut,
  // i.e $4,000 a year £333 a month or 'Unavailable'
  private doughnutLabelTestIds: Record<DoughnutPosition, string> = {
    left: 'donut-label-0',
    right: 'donut-label-1',
  };

  // doughnut legends are the text under the doughnut.
  // i.e. Latest Value 2025 or 'Unavailable'
  private doughnutLegendTestIds: Record<DoughnutPosition, string> = {
    left: 'donut-legend-0',
    right: 'donut-legend-1',
  };

  // These are the ID's for the actual bars themselves.
  private doughnutTestIds: Record<DoughnutPosition, string> = {
    left: 'donut-0',
    right: 'donut-1',
  };

  private doughnutSvgTestIds: Record<DoughnutPosition, DoughnutRings> = {
    left: {
      inner: 'donut-inner-0',
      outer: 'donut-outer-0',
      path: 'donut-arc-0',
    },
    right: {
      inner: 'donut-inner-1',
      outer: 'donut-outer-1',
      path: 'donut-arc-1',
    },
  };

  private leftDoughnutColours: Record<string, DoughnutRings> = {
    filled: {
      inner: 'stroke-slate-500 fill-white',
      path: 'stroke-slate-500 fill-slate-350',
      outer: 'stroke-slate-500 fill-white',
    },
    unfilled: {
      inner: 'stroke-slate-500 fill-white',
      path: 'stroke-slate-500 fill-slate-350',
      outer: 'stroke-slate-500 fill-white',
    },
  };

  private rightDoughnutColours: Record<string, DoughnutRings> = {
    filled: {
      inner: 'stroke-teal-700 fill-white',
      path: 'stroke-teal-700 fill-teal-700',
      outer: 'stroke-teal-700 fill-white',
    },
    unfilled: {
      inner: 'stroke-slate-500 fill-white',
      path: 'stroke-slate-500 fill-teal-700',
      outer: 'stroke-slate-500 fill-white',
    },
  };

  constructor(private readonly page: Page) {}
  /**
   * Returns the text of the doughnut chart header (inside the bounds of the doughnut chart)
   *
   * Using .innerText returns all text inside including grandchildren which has unexpected results.
   * i.e. Pot Value/nShow more information
   *
   * To get around this we specifically target the children, excluding the grandchildren, and get their text content.
   */
  async getDoughnutHeaderText() {
    return this.page.getByTestId('donut-heading').evaluate((el) =>
      Array.from(el.childNodes)
        .filter((e) => e.nodeType === Node.TEXT_NODE)
        .map((n) => n.textContent)
        .join('')
        .trim(),
    );
  }

  /**
   * Given a doughnut position, returns the text from the bars legend (below the doughnut)
   */
  async getDoughnutLegendText(doughnutPosition: DoughnutPosition) {
    const selector = this.doughnutLegendTestIds[doughnutPosition];
    return this.page.getByTestId(selector).innerText();
  }

  /**
   * Given a doughnut position, returns the text from the bars label (above the doughnut)
   */
  async getDoughnutLabelText(doughnutPosition: DoughnutPosition) {
    const selector = this.doughnutLabelTestIds[doughnutPosition];
    return this.page.getByTestId(selector).innerText();
  }

  /**
   * Given a doughnut position, returns height in pixels as string, example: "1px"
   */
  async getDoughnutPath(doughnutPosition: DoughnutPosition) {
    const selector = this.doughnutTestIds[doughnutPosition];
    return this.page
      .getByTestId(selector)
      .evaluate((el: HTMLElement) => el.offsetHeight);
  }

  /**
   * Given a doughnut position, returns the tailwind class name that sets the background colour.
   */
  async getColoursFromDom(
    doughnutPosition: DoughnutPosition,
  ): Promise<DoughnutRings> {
    const selectors = this.doughnutSvgTestIds[doughnutPosition];

    const outerClass = await this.page
      .getByTestId(selectors.outer)
      .getAttribute('class');

    const pathClass = await this.page
      .getByTestId(selectors.path)
      .getAttribute('class');

    const circles = this.page.locator(
      `[data-testid="${this.doughnutTestIds[doughnutPosition]}"] circle`,
    );
    const secondCircle = circles.nth(1);
    const innerClass = await secondCircle.getAttribute('class');

    // Element might not have a class attribute, so default to an empty string if so
    return {
      inner: innerClass ?? '',
      outer: outerClass ?? '',
      path: pathClass ?? '',
    };
  }

  async getColoursFromData(
    doughnutPosition: DoughnutPosition,
    doughnutFilledStatus: DoughnutFilledStatus,
  ): Promise<DoughnutRings> {
    let outerClass;
    let pathClass;
    let innerClass;

    if (doughnutPosition == 'right') {
      innerClass = this.rightDoughnutColours[doughnutFilledStatus].inner;
      outerClass = this.rightDoughnutColours[doughnutFilledStatus].outer;
      pathClass = this.rightDoughnutColours[doughnutFilledStatus].path;
    } else {
      innerClass = this.leftDoughnutColours[doughnutFilledStatus].inner;
      outerClass = this.leftDoughnutColours[doughnutFilledStatus].outer;
      pathClass = this.leftDoughnutColours[doughnutFilledStatus].path;
    }

    return {
      inner: innerClass ?? '',
      outer: outerClass ?? '',
      path: pathClass ?? '',
    };
  }

  async getAngleDegrees(center: Vector2, start: Vector2, end: Vector2) {
    const v1 = { x: start[0] - center[0], y: start[1] - center[1] };
    const v2 = { x: end[0] - center[0], y: end[1] - center[1] };
    const dot = v1.x * v2.x + v1.y * v2.y;

    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

    const cosTheta = dot / (mag1 * mag2);
    const angleRad = Math.acos(cosTheta);

    let angleDeg = angleRad * (180 / Math.PI);

    // Use cross product to determine direction
    const cross = v1.x * v2.y - v1.y * v2.x;

    if (cross < 0) {
      angleDeg = 360 - angleDeg;
    }

    return angleDeg;
  }

  // debug to check if this return exepceted data
  async getDoughnutDataFromPage() {
    return this.page.locator('[data-testid="donut-charts"]').innerText();
  }

  async openToolTip() {
    await this.page.getByTestId('tooltip-icon').nth(1).click();
  }

  async calculateFilledPercentage(doughnutPosition: DoughnutPosition) {
    const selector = this.doughnutTestIds[doughnutPosition];

    const pathLocator = this.page.locator(`[data-testid="${selector}"] > path`);
    const dValue = await pathLocator.getAttribute('d');

    const parsedPaths = dValue.split('\n').map((l) => l.trim());

    // Takes the last two numbers from a string and returns a Vector2 with them.
    const getLastTwoNumbers = (str: string): Vector2 =>
      str.trim().split(' ').slice(-2).map(Number) as Vector2;

    const movePath = parsedPaths.find((p) => p.startsWith('M')) ?? '';
    const endPoint = getLastTwoNumbers(movePath);

    // Only get arcs for the outer ring (radius 85)
    const outerArcPaths = parsedPaths.filter((p) => p.startsWith('A 85'));

    // if two outer arcs, % fill is 100
    if (outerArcPaths.length >= 2) {
      return 100; // 100% filled
    }

    // if there is only one outer arc % fill is less than 100
    const arcPath = parsedPaths.find((p) => p.startsWith('A')) ?? '';
    const startPoint = getLastTwoNumbers(arcPath);

    const assumedCentre: Vector2 = [startPoint[0], startPoint[0]];

    const angle = await this.getAngleDegrees(
      assumedCentre,
      startPoint,
      endPoint,
    );
    const percentage = angle / 360;

    return Math.round(percentage * 100);
  }

  async parseToNumber(value: string | null): Promise<number> {
    if (!value) return 0;

    // strip £, commas, spaces, etc.
    const cleaned = value.replace(/[^0-9.-]+/g, '');

    // use parseFloat to handle decimals
    const num = parseFloat(cleaned);

    // fallback to 0 if result is NaN
    return isNaN(num) ? 0 : num;
  }

  async calculateDoughnutFillFromData(
    leftValue: string | null,
    rightValue: string | null,
  ): Promise<{ leftPercentage: number; rightPercentage: number }> {
    const parseValue = (value: string | null): number => {
      if (!value) return 0;
      return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
    };

    const left = parseValue(leftValue);
    const right = parseValue(rightValue);

    if (left === 0 && right === 0) {
      return { leftPercentage: 0, rightPercentage: 0 };
    }

    let leftPercentage: number;
    let rightPercentage: number;

    if (left >= right) {
      leftPercentage = 100;
      rightPercentage = right === 0 ? 0 : (right / left) * 100;
    } else {
      leftPercentage = left === 0 ? 0 : (left / right) * 100;
      rightPercentage = 100;
    }

    return {
      leftPercentage: Math.round(leftPercentage),
      rightPercentage: Math.round(rightPercentage),
    };
  }
}

export default DoughnutChart;

import { type Page } from '@maps/playwright';

type DonutPosition = 'left' | 'right';

type DonutFilledStatus = 'filled' | 'unfilled';

type Vector2 = [number, number]; // first is x, second is y

interface DonutRings {
  inner: string;
  outer: string;
  path: string;
}

class DonutChart {
  static readonly MaxBarHeightInPixels = 135;
  static readonly MinBarHeightInPixels = 1;

  // donut labels are the text above the donut,
  // i.e $4,000 a year £333 a month or 'Unavailable'
  private readonly donutLabelTestIds: Record<DonutPosition, string> = {
    left: 'donut-label-0',
    right: 'donut-label-1',
  };

  // donut legends are the text under the donut.
  // i.e. Latest Value 2025 or 'Unavailable'
  private readonly donutLegendTestIds: Record<DonutPosition, string> = {
    left: 'donut-legend-0',
    right: 'donut-legend-1',
  };

  // These are the ID's for the actual bars themselves.
  private readonly donutTestIds: Record<DonutPosition, string> = {
    left: 'donut-0',
    right: 'donut-1',
  };

  private readonly donutSvgTestIds: Record<DonutPosition, DonutRings> = {
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

  private readonly leftDonutColours: Record<string, DonutRings> = {
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

  private readonly rightDonutColours: Record<string, DonutRings> = {
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
   * Returns the text of the donut chart header (inside the bounds of the donut chart)
   *
   * Using .innerText returns all text inside including grandchildren which has unexpected results.
   * i.e. Pot Value/nShow more information
   *
   * To get around this we specifically target the children, excluding the grandchildren, and get their text content.
   */
  get donutHeaderText() {
    return this.page.getByTestId('donut-heading').evaluate((el) =>
      Array.from(el.childNodes)
        .filter((e) => e.nodeType === Node.TEXT_NODE)
        .map((n) => n.textContent)
        .join('')
        .trim(),
    );
  }

  /**
   * Given a donut position, returns the text from the bars legend (below the donut)
   */
  async getDonutLegendText(donutPosition: DonutPosition) {
    const selector = this.donutLegendTestIds[donutPosition];
    return this.page.getByTestId(selector).innerText();
  }

  /**
   * Given a donut position, returns the text from the bars label (above the donut)
   */
  async getDonutLabelText(donutPosition: DonutPosition) {
    const selector = this.donutLabelTestIds[donutPosition];
    return this.page.getByTestId(selector).innerText();
  }

  /**
   * Given a donut position, returns height in pixels as string, example: "1px"
   */
  async getDonutPath(donutPosition: DonutPosition) {
    const selector = this.donutTestIds[donutPosition];
    return this.page
      .getByTestId(selector)
      .evaluate((el: HTMLElement) => el.offsetHeight);
  }

  /**
   * Given a donut position, returns the tailwind class name that sets the background colour.
   */
  async getColoursFromDom(donutPosition: DonutPosition): Promise<DonutRings> {
    const selectors = this.donutSvgTestIds[donutPosition];

    const outerClass = await this.page
      .getByTestId(selectors.outer)
      .getAttribute('class');

    const pathClass = await this.page
      .getByTestId(selectors.path)
      .getAttribute('class');

    const circles = this.page.locator(
      `[data-testid="${this.donutTestIds[donutPosition]}"] circle`,
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
    donutPosition: DonutPosition,
    donutFilledStatus: DonutFilledStatus,
  ): Promise<DonutRings> {
    let outerClass;
    let pathClass;
    let innerClass;

    if (donutPosition == 'right') {
      innerClass = this.rightDonutColours[donutFilledStatus].inner;
      outerClass = this.rightDonutColours[donutFilledStatus].outer;
      pathClass = this.rightDonutColours[donutFilledStatus].path;
    } else {
      innerClass = this.leftDonutColours[donutFilledStatus].inner;
      outerClass = this.leftDonutColours[donutFilledStatus].outer;
      pathClass = this.leftDonutColours[donutFilledStatus].path;
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

    const mag1 = Math.hypot(v1.x, v1.y);
    const mag2 = Math.hypot(v2.x, v2.y);

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

  // debug to check if this return expected data
  get donutDataFromPage() {
    return this.page.locator('[data-testid="donut-charts"]').innerText();
  }

  async openToolTip() {
    await this.page.getByTestId('tooltip-icon').nth(2).click();
  }

  async calculateFilledPercentage(donutPosition: DonutPosition) {
    const selector = this.donutTestIds[donutPosition];

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
    const num = Number.parseFloat(cleaned);

    // fallback to 0 if result is NaN
    return Number.isNaN(num) ? 0 : num;
  }

  async calculateDonutFillFromData(
    leftValue: string | null,
    rightValue: string | null,
  ): Promise<{ leftPercentage: number; rightPercentage: number }> {
    const parseValue = (value: string | null): number => {
      if (!value) return 0;
      return Number.parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
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

export default DonutChart;

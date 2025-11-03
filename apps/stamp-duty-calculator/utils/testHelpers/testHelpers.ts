export const toBeWithinRange = (
  received: number,
  floor: number,
  ceiling: number,
) => {
  const pass = received >= floor && received <= ceiling;
  if (pass) {
    return {
      message: () =>
        `expected ${received} not to be within range ${floor} - ${ceiling}`,
      pass: true,
    };
  } else {
    return {
      message: () =>
        `expected ${received} to be within range ${floor} - ${ceiling}`,
      pass: false,
    };
  }
};

export const setupToBeWithinRange = () => {
  expect.extend({
    toBeWithinRange,
  });
};

export const createTaxCalculationTestCase = <T extends string>(
  testCase: {
    price: number;
    buyerType: T;
    tax: number;
    percent: number;
  },
  _calculatorName: string,
  calculateFn: (
    price: number,
    buyerType: T,
  ) => { tax: number; percentage: number },
) => {
  const title = `[${testCase.buyerType}]`;

  return {
    name: `calculates for a ${title} with a price of ${testCase.price} at ${testCase.tax} (${testCase.percent}%)`,
    fn: () => {
      const result = calculateFn(testCase.price, testCase.buyerType);
      // Use toBeCloseTo for floating-point comparison to handle precision issues
      expect(result.tax).toBeCloseTo(testCase.tax, 2);
      expect(result.percentage).toBeWithinRange(
        testCase.percent - 0.01,
        testCase.percent + 0.01,
      );
    },
  };
};

export const createMockBaseCalculator = () =>
  jest.fn(
    ({
      config,
      initialValues,
      calculated,
      analyticsData,
      isEmbedded,
    }: {
      config: { name: string };
      initialValues: { buyerType: string; price: string };
      calculated: boolean;
      analyticsData?: { event?: string };
      isEmbedded: boolean;
    }) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const React = require('react');
      return React.createElement(
        'div',
        { 'data-testid': 'base-calculator' },
        React.createElement(
          'div',
          { 'data-testid': 'config-name' },
          config.name,
        ),
        React.createElement(
          'div',
          { 'data-testid': 'initial-buyerType' },
          initialValues.buyerType,
        ),
        React.createElement(
          'div',
          { 'data-testid': 'initial-price' },
          initialValues.price,
        ),
        React.createElement(
          'div',
          { 'data-testid': 'calculated' },
          calculated.toString(),
        ),
        React.createElement(
          'div',
          { 'data-testid': 'isEmbedded' },
          isEmbedded.toString(),
        ),
        React.createElement(
          'div',
          { 'data-testid': 'analytics-event' },
          analyticsData?.event ?? 'none',
        ),
      );
    },
  );

export const createMockTaxConfig = ({
  name,
  title,
  analyticsToolName,
  fields = [
    { name: 'buyerType', label: 'I am buying', type: 'select' },
    { name: 'price', label: 'Property price', type: 'money' },
  ],
}: {
  name: string;
  title: string;
  analyticsToolName: string;
  fields?: { name: string; label: string; type: string }[];
}) => {
  return {
    name,
    title,
    analyticsToolName,
    fields,
  };
};

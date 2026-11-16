import { pensionTypeAnalytics, stepData } from './pension-type';

const mockZ = jest.fn(({ en }: { en: string; cy: string }) => en);

describe('stepData', () => {
  beforeEach(() => mockZ.mockClear());

  it.each([1, 2, 3, 4, 5, 6] as const)(
    'step %i returns pageName, pageTitle and stepName',
    (step) => {
      const result = stepData[step](mockZ as never);
      expect(result.pageName).toBeTruthy();
      expect(result.pageTitle).toBeTruthy();
      expect(result.stepName).toBeTruthy();
    },
  );

  it('error step returns empty pageName and error stepName', () => {
    const result = stepData.error(mockZ as never);
    expect(result.pageName).toBe('');
    expect(result.stepName).toBe('error-message');
    expect(result.pageTitle).toBe('Error, please review your answer');
  });

  it('landing step returns empty pageName and correct stepName', () => {
    const result = stepData.landing(mockZ as never);
    expect(result.pageName).toBe('');
    expect(result.stepName).toBe('Find out your pension type');
  });
});

describe('pensionTypeAnalytics', () => {
  beforeEach(() => mockZ.mockClear());

  it.each([1, 2, 3, 4, 5, 6] as const)(
    'returns analytics object for numeric step %i',
    (step) => {
      const result = pensionTypeAnalytics(mockZ as never, step);
      expect(result).toBeDefined();
      expect(result.tool.toolStep).toBe(`${step}`);
    },
  );

  it('returns analytics object for error step', () => {
    const result = pensionTypeAnalytics(mockZ as never, 'error');
    expect(result).toBeDefined();
    expect(result.tool.toolStep).toBe('error');
  });

  it('returns analytics object for landing step', () => {
    const result = pensionTypeAnalytics(mockZ as never, 'landing');
    expect(result).toBeDefined();
    expect(result.tool.toolStep).toBe('landing');
  });

  it('includes tool and toolCy fields', () => {
    const result = pensionTypeAnalytics(mockZ as never, 1);
    expect(result.tool.toolName).toBe('Pension Type');
  });

  it('includes categoryLevels', () => {
    const result = pensionTypeAnalytics(mockZ as never, 1);
    expect(result.page.categoryLevels).toEqual([
      'Pensions & retirement',
      'Pension Wise',
    ]);
  });
});

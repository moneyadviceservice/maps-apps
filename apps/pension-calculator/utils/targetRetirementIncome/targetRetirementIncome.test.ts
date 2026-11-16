import {
  FREQUENCY_MONTH,
  FREQUENCY_WEEK,
  FREQUENCY_YEAR,
} from 'data/frequency';

import {
  amountForFrequency,
  annualAmount,
  displayedTarget,
  replacementRate,
  targetRetirementIncome,
} from './targetRetirementIncome';

describe('replacementRate', () => {
  it.each([
    [0, 80],
    [15_899, 80],
    [15_900, 70],
    [29_000, 70],
    [29_001, 67],
    [42_000, 67],
    [42_001, 60],
    [66_999, 60],
    [67_000, 50],
    [80_000, 50],
  ])('a yearly salary of £%s uses a %s% replacement rate', (salary, rate) => {
    expect(replacementRate(salary)).toBe(rate);
  });
});

describe('annualAmount', () => {
  it('keeps a yearly amount', () => {
    expect(annualAmount(20_000, FREQUENCY_YEAR)).toBe(20_000);
  });

  it('multiplies a monthly amount by 12', () => {
    expect(annualAmount(2_000, FREQUENCY_MONTH)).toBe(24_000);
  });

  it('multiplies a weekly amount by 52', () => {
    expect(annualAmount(200, FREQUENCY_WEEK)).toBe(10_400);
  });
});

describe('displayedTarget', () => {
  const yearlyTarget = 14_000;

  it('rounds a yearly target to the nearest pound', () => {
    expect(displayedTarget(yearlyTarget, FREQUENCY_YEAR)).toBe(14_000);
  });

  it('rounds a monthly target after dividing by 12', () => {
    expect(amountForFrequency(yearlyTarget, FREQUENCY_MONTH)).toBeCloseTo(
      14_000 / 12,
    );
    expect(displayedTarget(yearlyTarget, FREQUENCY_MONTH)).toBe(1_167);
  });

  it('rounds a weekly target after dividing by 52', () => {
    expect(amountForFrequency(yearlyTarget, FREQUENCY_WEEK)).toBeCloseTo(
      14_000 / 52,
    );
    expect(displayedTarget(yearlyTarget, FREQUENCY_WEEK)).toBe(269);
  });
});

describe('targetRetirementIncome', () => {
  it('sets a £20,000 salary to 70% and £14,000 a year', () => {
    expect(targetRetirementIncome('20000', FREQUENCY_YEAR)).toEqual({
      annualIncome: 20_000,
      replacementRate: 70,
      annualTarget: 14_000,
    });
  });

  it('reads a salary that includes commas', () => {
    expect(targetRetirementIncome('26,900', FREQUENCY_YEAR)).toMatchObject({
      annualIncome: 26_900,
      replacementRate: 70,
      annualTarget: 18_830,
    });
  });

  it('annualises monthly pay before choosing the rate', () => {
    expect(targetRetirementIncome('2000', FREQUENCY_MONTH)).toMatchObject({
      annualIncome: 24_000,
      replacementRate: 70,
      annualTarget: 16_800,
    });
  });

  it('annualises weekly pay before choosing the rate', () => {
    const result = targetRetirementIncome('200', FREQUENCY_WEEK);

    expect(result.annualIncome).toBe(10_400);
    expect(result.replacementRate).toBe(80);
    expect(displayedTarget(result.annualTarget, FREQUENCY_WEEK)).toBe(160);
  });

  it('treats a blank salary as zero', () => {
    expect(targetRetirementIncome('', FREQUENCY_YEAR)).toMatchObject({
      annualIncome: 0,
      replacementRate: 80,
      annualTarget: 0,
    });
  });

  it('adds yearly other income before choosing the rate', () => {
    expect(
      targetRetirementIncome('20000', FREQUENCY_YEAR, [
        { name: 'Savings', amount: '5000', frequency: FREQUENCY_YEAR },
      ]),
    ).toEqual({
      annualIncome: 25_000,
      replacementRate: 70,
      annualTarget: 17_500,
    });
  });

  it('moves the combined income into the next band', () => {
    expect(
      targetRetirementIncome('29000', FREQUENCY_YEAR, [
        { name: 'Benefits', amount: '2000', frequency: FREQUENCY_YEAR },
      ]),
    ).toEqual({
      annualIncome: 31_000,
      replacementRate: 67,
      annualTarget: 20_770,
    });
  });

  it('annualises each other-income row on its own frequency', () => {
    expect(
      targetRetirementIncome('1000', FREQUENCY_MONTH, [
        { name: 'Rent', amount: '100', frequency: FREQUENCY_WEEK },
        { name: 'Savings', amount: '500', frequency: FREQUENCY_MONTH },
      ]),
    ).toMatchObject({
      annualIncome: 23_200,
      replacementRate: 70,
      annualTarget: 16_240,
    });
  });

  it('ignores a blank other-income row and includes every completed row', () => {
    expect(
      targetRetirementIncome('20000', FREQUENCY_YEAR, [
        { name: '', amount: '', frequency: FREQUENCY_YEAR },
        { name: 'Savings', amount: '1000', frequency: FREQUENCY_YEAR },
        { name: 'Investments', amount: '   ', frequency: FREQUENCY_MONTH },
        { name: 'Rent', amount: '2,000', frequency: FREQUENCY_YEAR },
      ]),
    ).toMatchObject({
      annualIncome: 23_000,
      replacementRate: 70,
      annualTarget: 16_100,
    });
  });
});

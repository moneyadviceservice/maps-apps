import { getHmrcRates, isScottishTaxRates } from './getHmrcRates';

describe('getHmrcRates', () => {
  test('It uses default 2024/25 rates', () => {
    const rates = getHmrcRates();
    expect(rates.DEFAULT_PERSONAL_ALLOWANCE).toEqual(12570);
    expect(rates.NI_MIDDLE_RATE).toEqual(0.08);
  });

  test('It uses explicit 2022/23 rates', () => {
    expect(
      getHmrcRates({ taxYear: '2022/23', country: 'England/NI/Wales' })
        .DEFAULT_PERSONAL_ALLOWANCE,
    ).toEqual(12570);
  });

  test('It uses explicit 2023/24 rates', () => {
    expect(
      getHmrcRates({ taxYear: '2023/24', country: 'England/NI/Wales' })
        .DEFAULT_PERSONAL_ALLOWANCE,
    ).toEqual(12570);
  });

  test('It uses explicit 2024/25 rates', () => {
    expect(
      getHmrcRates({ taxYear: '2024/25', country: 'England/NI/Wales' })
        .DEFAULT_PERSONAL_ALLOWANCE,
    ).toEqual(12570);
  });

  const rates = getHmrcRates({
    country: 'England/NI/Wales',
    taxYear: '2025/26',
  });
  expect(rates.COUNTRY).toBe('England/NI/Wales');
  expect(rates.DEFAULT_PERSONAL_ALLOWANCE).toBe(12570);
});

it('returns Scottish tax rates for Scotland', () => {
  const rates = getHmrcRates({ country: 'Scotland', taxYear: '2025/26' });
  expect(rates.COUNTRY).toBe('Scotland');
  expect(rates.DEFAULT_PERSONAL_ALLOWANCE).toBe(12570);
});

it('defaults to 2025/26 if no taxYear provided', () => {
  const rates = getHmrcRates({ country: 'England/NI/Wales' });
  expect(rates.COUNTRY).toBe('England/NI/Wales');
  expect(rates.DEFAULT_PERSONAL_ALLOWANCE).toBe(12570);
});

it('throws if unsupported tax year is requested', () => {
  expect(() =>
    getHmrcRates({ country: 'England/NI/Wales', taxYear: '2099/00' as any }),
  ).toThrow('Tax Year 2099/00 is not currently supported for England/NI/Wales');
});

it('returns true for Scottish tax rates', () => {
  const scotRates = getHmrcRates({ country: 'Scotland', taxYear: '2025/26' });
  expect(isScottishTaxRates(scotRates)).toBe(true);
});

it('returns false for English tax rates', () => {
  const engRates = getHmrcRates({
    country: 'England/NI/Wales',
    taxYear: '2025/26',
  });
  expect(isScottishTaxRates(engRates)).toBe(false);
});

it('throws if unsupported tax year is requested for England/NI/Wales', () => {
  expect(() =>
    getHmrcRates({ country: 'England/NI/Wales', taxYear: '2099/00' as any }),
  ).toThrow('Tax Year 2099/00 is not currently supported for England/NI/Wales');
});

it('throws if unsupported tax year is requested for Scotland', () => {
  expect(() =>
    getHmrcRates({ country: 'Scotland', taxYear: '2099/00' as any }),
  ).toThrow('Tax Year 2099/00 is not currently supported for Scotland');
});

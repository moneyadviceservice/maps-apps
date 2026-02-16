import { getPensionContribution } from './getPensionContribution';

describe('getPensionContribution', () => {
  it('returns percentage type and value when pensionPercent is provided', () => {
    const result = getPensionContribution({
      pensionPercent: '5',
      pensionFixed: '',
    });
    expect(result).toEqual({ pensionType: 'percentage', pensionValue: 5 });
  });

  it('returns fixed type and value when pensionFixed is provided', () => {
    const result = getPensionContribution({
      pensionPercent: '',
      pensionFixed: '100',
    });
    expect(result).toEqual({ pensionType: 'fixed', pensionValue: 100 });
  });

  it('returns percentage type when both pensionPercent and pensionFixed are provided and pensionPercent is not 0', () => {
    const result = getPensionContribution({
      pensionPercent: '7',
      pensionFixed: '200',
    });
    expect(result).toEqual({ pensionType: 'percentage', pensionValue: 7 });
  });

  it('returns fixed type when pensionPercent is "0" and pensionFixed is provided', () => {
    const result = getPensionContribution({
      pensionPercent: '0',
      pensionFixed: '150',
    });
    expect(result).toEqual({ pensionType: 'fixed', pensionValue: 150 });
  });

  it('returns fixed type with value 0 when neither pensionPercent nor pensionFixed is provided', () => {
    const result = getPensionContribution({});
    expect(result).toEqual({ pensionType: 'fixed', pensionValue: null });
  });

  it('returns fixed type with value 0 when both pensionPercent and pensionFixed are "0"', () => {
    const result = getPensionContribution({
      pensionPercent: '0',
      pensionFixed: '0',
    });
    expect(result).toEqual({ pensionType: 'fixed', pensionValue: null });
  });

  it('returns fixed type with value 0 when both pensionPercent and pensionFixed are empty strings', () => {
    const result = getPensionContribution({
      pensionPercent: '',
      pensionFixed: '',
    });
    expect(result).toEqual({ pensionType: 'fixed', pensionValue: null });
  });
});

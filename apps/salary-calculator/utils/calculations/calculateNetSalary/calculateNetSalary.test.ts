import { calculateNetSalary } from './calculateNetSalary';
import { convertToAnnualSalary } from '../convertToAnnualSalary/convertToAnnualSalary';

describe('calculateNetSalary', () => {
  it('calculates net salary for £79,000 in England 2025/26', () => {
    const result = calculateNetSalary({
      grossSalary: 79000,
      country: 'England/NI/Wales',
      taxYear: '2025/26',
    });
    expect(result.incomeTax).toBe(19032);
    expect(result.nationalInsurance).toBe(3590.32);
    expect(result.netSalary).toBe(56377.68);
  });

  it('calculates net salary for £79,000 in Scotland 2025/26', () => {
    const result = calculateNetSalary({
      grossSalary: 79000,
      country: 'Scotland',
      taxYear: '2025/26',
    });
    expect(result.incomeTax).toBe(21313.54);
    expect(result.nationalInsurance).toBe(3590.32);
    expect(result.netSalary).toBe(54096.14);
  });

  it('calculates net salary for an annual salary using convertToAnnualSalary', () => {
    const grossSalary = convertToAnnualSalary({
      amount: 50000,
      frequency: 'yearly',
    });
    const result = calculateNetSalary({
      grossSalary,
      country: 'England/NI/Wales',
      taxYear: '2025/26',
    });
    expect(result.incomeTax).toBe(7486);
    expect(result.nationalInsurance).toBe(2993.28);
    expect(result.netSalary).toBe(39520.72);
  });

  it('calculates net salary for a monthly salary using convertToAnnualSalary', () => {
    const monthly = 5000;
    const grossSalary = convertToAnnualSalary({
      amount: monthly,
      frequency: 'monthly',
    });
    const result = calculateNetSalary({
      grossSalary,
      country: 'England/NI/Wales',
      taxYear: '2025/26',
    });
    expect(result.incomeTax).toBe(11432);
    expect(result.nationalInsurance).toBe(3210.32);
    expect(result.netSalary).toBe(45357.68);
  });

  it('calculates net salary for a daily salary using convertToAnnualSalary', () => {
    const daily = 400;
    const grossSalary = convertToAnnualSalary({
      amount: daily,
      frequency: 'daily',
      daysPerWeek: 5,
    });
    const result = calculateNetSalary({
      grossSalary,
      country: 'England/NI/Wales',
      taxYear: '2025/26',
    });
    expect(result.incomeTax).toBe(29832);
    expect(result.nationalInsurance).toBe(4090.32);
    expect(result.netSalary).toBe(70077.68);
  });

  it('calculates net salary for a weekly salary using convertToAnnualSalary', () => {
    const weekly = 800;
    const grossSalary = convertToAnnualSalary({
      amount: weekly,
      frequency: 'weekly',
    });
    const result = calculateNetSalary({
      grossSalary,
      country: 'England/NI/Wales',
      taxYear: '2025/26',
    });
    expect(result.incomeTax).toBe(5806);
    expect(result.nationalInsurance).toBe(2321.28);
    expect(result.netSalary).toBe(33472.72);
  });

  it('calculates net salary for an hourly salary using convertToAnnualSalary', () => {
    const hourly = 25;
    const grossSalary = convertToAnnualSalary({
      amount: hourly,
      frequency: 'hourly',
      hoursPerWeek: 40,
    });
    const result = calculateNetSalary({
      grossSalary,
      country: 'England/NI/Wales',
      taxYear: '2025/26',
    });
    expect(result.incomeTax).toBe(8232);
    expect(result.nationalInsurance).toBe(3050.32);
    expect(result.netSalary).toBe(40717.68);
  });
});

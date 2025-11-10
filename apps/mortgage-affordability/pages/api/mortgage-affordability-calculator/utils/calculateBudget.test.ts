import { calculateBudget } from './calculateBudget';

const formDataMock = {
  'q-take-home': '3,500.00',
  'q-sec-take-home': '1,000.00',
  'q-card-and-loan': '300.00',
  'q-child-spousal': '200.00',
  'q-care-school': '1,000',
  'q-travel': '250',
  'q-bills-insurance': '150',
  'q-rent-mortgage': '1,200',
  'q-leisure': '100',
  'q-holidays': '50',
  'q-groceries': '200.75',
};

describe('calculateBudget', () => {
  it('should return true if income is greater than or equal to expenses', () => {
    expect(calculateBudget(formDataMock)).toBe(true);
  });

  it('should return false if income is less than expenses', () => {
    const formDataWithLowerIncome = {
      ...formDataMock,
      'q-take-home': '1,000.00',
      'q-sec-take-home': '500.00',
    };
    expect(calculateBudget(formDataWithLowerIncome)).toBe(false);
  });

  it('should handle empty form data gracefully', () => {
    const emptyFormData = {};
    expect(calculateBudget(emptyFormData)).toBe(true);
  });
});

import { defaultPotsOfMoneyData } from 'types/pensions';

import {
  validateContributions,
  validatePotDetails,
  validatePotScreening,
} from './pensions';

describe('pension validation', () => {
  it('requires a screening answer', () => {
    expect(validatePotScreening(defaultPotsOfMoneyData())).toEqual({
      'has-pot-of-money-pension-0': [
        'Select yes if you have a pension that builds up a pot of money.',
      ],
    });
  });

  it('validates a mandatory current pot value and optional tax-free cash', () => {
    const data = defaultPotsOfMoneyData();
    data.pots[0].taxFreeCash = 'abc';
    expect(validatePotDetails(data)).toEqual({
      'pension-pot-0-currentValue': [
        'Enter the current value of your pension.',
      ],
      'pension-pot-0-taxFreeCash': ['Enter an amount in pounds, like 26900'],
    });
  });

  it('accepts contribution percentages at the inclusive bounds only', () => {
    const data = defaultPotsOfMoneyData();
    data.employeeContribution.value = '101';
    data.employerContribution.value = '0';
    expect(validateContributions(data)).toEqual({
      'employee-contribution-value': ['Enter a percentage between 0 and 100'],
    });
  });
});

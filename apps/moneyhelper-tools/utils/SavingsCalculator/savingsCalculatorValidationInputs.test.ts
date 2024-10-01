import { SavingsCalculatorType } from 'components/SavingsCalculator/SavingsCalculator';
import { savingsValidateInputs } from './savingsCalculatorValidationInputs';

describe('savingsValidateInputs', () => {
  it('should return no errors for valid inputs', () => {
    const date = new Date();
    const inputs = {
      savingGoal: '100',
      durationMonth: date.getMonth().toString(),
      durationYear: (date.getFullYear() + 1).toString(),
      saved: '10',
      interest: '2.1',
    };

    const result = savingsValidateInputs({
      inputs: inputs,
      type: SavingsCalculatorType.HOW_LONG,
    });

    expect(result).toEqual([]);
  });

  it('should return error if date is in past for valid inputs', () => {
    const inputs = {
      savingGoal: '1000000000',
      durationMonth: '1',
      durationYear: '2024',
      saved: '0.50',
      interest: '2.1',
    };

    const result = savingsValidateInputs({
      inputs: inputs,
      type: SavingsCalculatorType.HOW_LONG,
    });

    expect(result).toEqual([
      {
        field: 'savingGoal',
        type: 'max',
      },
      { field: 'saved', type: 'invalid' },
      { field: 'saved', type: 'min' },
      {
        field: 'date',
        type: 'invalid',
      },
    ]);
  });

  it('should return error if date is matching current month and year', () => {
    const date = new Date();
    const inputs = {
      savingGoal: '100',
      durationMonth: date.getMonth().toString(),
      durationYear: date.getFullYear().toString(),
      saved: '10',
      interest: '2.1',
    };

    const result = savingsValidateInputs({
      inputs: inputs,
      type: SavingsCalculatorType.HOW_LONG,
    });

    expect(result).toEqual([
      {
        field: 'date',
        type: 'required',
      },
    ]);
  });

  it('should return error for all required or invalid', () => {
    const date = new Date();
    const inputs = {
      savingGoal: '',
      durationMonth: date.getMonth().toString(),
      durationYear: date.getFullYear().toString(),
      saved: '',
      interest: '10.000000',
    };

    const errors = savingsValidateInputs({
      inputs: inputs,
      type: SavingsCalculatorType.HOW_LONG,
    });

    expect(errors).toEqual([
      { field: 'savingGoal', type: 'required' },
      { field: 'saved', type: 'required' },
      { field: 'interest', type: 'max' },
      { field: 'interest', type: 'invalid' },
      { field: 'date', type: 'required' },
    ]);
  });
});

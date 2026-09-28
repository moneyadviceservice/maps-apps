import { getReactComponentType, ReactComponentType } from './getComponentType';

describe('getReactComponentType', () => {
  it('should return the correct React component type for valid currentStep', () => {
    expect(getReactComponentType(0)).toBe(
      ReactComponentType.QuestionRadioButton,
    );
    expect(getReactComponentType(1)).toBe(
      ReactComponentType.QuestionDateDayMonthYear,
    );
    expect(getReactComponentType(4)).toBe(ReactComponentType.QuestionSalary);
    expect(getReactComponentType(6)).toBe(
      ReactComponentType.QuestionContractualRedundancy,
    );
  });
});

export enum ReactComponentType {
  QuestionRadioButton = 'QuestionRadioButton',
  QuestionDateDayMonthYear = 'QuestionDateDayMonthYear',
  QuestionDateMonthYear = 'QuestionDateMonthYear',
  QuestionSalary = 'QuestionSalary',
  QuestionContractualRedundancy = 'QuestionContractualRedundancy',
}

/**
 * Retrieves the React component type corresponding to the given step in the process.
 *
 * @param currentStep - The current step index for which the React component type is needed.
 * @returns The React component type associated with the specified step.
 */
export const getReactComponentType = (
  currentStep: number,
): ReactComponentType => {
  const componentTypes = [
    ReactComponentType.QuestionRadioButton,
    ReactComponentType.QuestionDateDayMonthYear,
    ReactComponentType.QuestionDateMonthYear,
    ReactComponentType.QuestionDateMonthYear,
    ReactComponentType.QuestionSalary,
    ReactComponentType.QuestionRadioButton,
    ReactComponentType.QuestionContractualRedundancy,
  ];

  return componentTypes[currentStep];
};

export const getDefaultValues = (enteredValues: string) => {
  const defaultValues = enteredValues.split('-');
  const threePartDate = defaultValues.length === 3;
  const twoPartDate = defaultValues.length === 2;

  if (threePartDate) {
    return {
      day: defaultValues[0],
      month: defaultValues[1],
      year: defaultValues[2],
    };
  }
  if (twoPartDate) {
    return {
      month: defaultValues[0],
      year: defaultValues[1],
    };
  }
  return {
    day: '',
    month: '',
    year: '',
  };
};

export const getDefaultValues = (
  enteredValues: string,
): { day: string; month: string; year: string } => {
  const defaultValues = enteredValues.split('-');
  if (defaultValues.length === 3) {
    return {
      day: defaultValues[0],
      month: defaultValues[1],
      year: defaultValues[2],
    };
  }
  if (defaultValues.length === 2) {
    return {
      day: '',
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

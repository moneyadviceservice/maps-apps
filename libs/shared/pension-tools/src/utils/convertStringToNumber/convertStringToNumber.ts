export const convertStringToNumber = (val: string) => {
  if (typeof val === 'string' && val.trim() !== '') {
    const numericVal = parseFloat(val.replaceAll(/,/g, ''));
    if (!isNaN(numericVal) && numericVal !== 0) {
      return numericVal;
    }
  } else if (typeof val === 'number') {
    return val;
  }

  return 0;
};

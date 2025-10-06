export const roundToNearestHundred = (value: number): number => {
  const remainder = value % 100;
  return value - remainder;
};

export const sum = (items: number[]) => {
  let result = 0;
  for (const item of items) {
    result += item;
  }
  return result;
};

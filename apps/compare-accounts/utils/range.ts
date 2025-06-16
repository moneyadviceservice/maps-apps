const range = (start: number, end: number): number[] => {
  const results: number[] = [];
  for (let i = start; i <= end; i++) {
    results.push(i);
  }
  return results;
};

export default range;

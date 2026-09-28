const transformCreditOptionsData = (
  error: boolean,
  data: Record<string, any>,
  question: string,
) => {
  let transformedData = { ...data };
  if (error) {
    transformedData = {
      ...transformedData,
      error: question,
    };
  }
  return transformedData;
};

export const transformData = (
  error: boolean,
  data: Record<string, any>,
  question: string,
): Record<string, any> | undefined => {
  return transformCreditOptionsData(error, data, question);
};

export const transformData = (
  error: boolean,
  data: Record<string, any>,
  question: string,
) => {
  let tdata = { ...data };
  if (error) {
    tdata = {
      ...tdata,
      error: question,
    };
  }
  return tdata;
};

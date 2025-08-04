export const getRetirementAge = (
  retirement: string | undefined,
  birth: string | undefined,
) => {
  // Parse the date strings into Date objects
  if (retirement === undefined || birth === undefined) {
    return 'N/A';
  }
  const birthDate = new Date(birth);
  const retirementDate = new Date(retirement);
  let yearsDifference = retirementDate.getFullYear() - birthDate.getFullYear();

  const anniversaryThisYear = new Date(
    retirementDate.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate(),
  );
  if (retirementDate < anniversaryThisYear) {
    yearsDifference--;
  }

  return yearsDifference;
};

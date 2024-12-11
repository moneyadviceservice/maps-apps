export const validateEmail = (email: string) => {
  return /^((?!\.)[\w\-.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.])$/.exec(
    email.toLowerCase(),
  );
};

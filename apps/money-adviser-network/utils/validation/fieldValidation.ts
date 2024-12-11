export const textField = (val: string, maxChar = 30) => {
  const isAlphabetic = /^[A-Za-z'_]+([-_'][A-Za-z'_]+)*$/.test(val);
  return val.length > 1 && val.length <= maxChar && isAlphabetic;
};

export const referenceField = (val: string, maxChar = 20) => {
  const isAllowedChars = /^[A-Za-z0-9_/-\s]+$/.test(val);
  return val.length <= maxChar && isAllowedChars;
};

export const emailField = (val: string) => {
  const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
  return emailRegex.test(val);
};

export const phoneField = (val: string) => {
  const phoneRegex = /^((\+44)|(0)) ?\d{4} ?\d{6}$/;
  return phoneRegex.test(val);
};

export const postcodeField = (val: string) => {
  const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
  return postcodeRegex.test(val);
};

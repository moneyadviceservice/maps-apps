export const textField = (val: string, maxChar = 30) => {
  const parts = val.split(/[-_']/);
  const isAlphabetic = parts.every((part) => /^[A-Za-z'_\s]+$/.test(part));
  return val.length > 1 && val.length <= maxChar && isAlphabetic;
};

export const referenceField = (val: string, maxChar = 20) => {
  const isAllowedChars = /^[A-Za-z0-9_/-\s]+$/.test(val);
  return val.length <= maxChar && isAllowedChars;
};

export const emailField = (val: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(val);
};

export const phoneField = (val: string) => {
  const phoneRegex = /^((\+44)) ?\d{4} ?\d{6}$/;
  return phoneRegex.test(val);
};

export const postcodeField = (val: string) => {
  const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
  return postcodeRegex.test(val);
};

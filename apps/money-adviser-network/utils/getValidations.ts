const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;

export const validatePostcode = (value: string) => !postcodeRegex.test(value);

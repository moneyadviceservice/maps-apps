export const replacePlaceholder = (
  key: string,
  value: string,
  content: string,
) => {
  return content.replace(`{${key}}`, value);
};

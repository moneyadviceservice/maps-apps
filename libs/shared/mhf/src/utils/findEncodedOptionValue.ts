type EncodedOption = {
  value?: string;
};

/**
 * Finds the encoded option value that starts with the selected value followed by a pipe character.
 * Used on radio button form elements to pre-fill the selected option based on the stored plain value.
 * EG: If the stored (REDIS instance) plain value is "yes" and the encoded options are ["yes|access-options", "no|access-options"], this function will return "yes|access-options".
 * @param options - The list of encoded option objects to search through.
 * @param selectedValue - The plain value to match at the start of the encoded option value.
 */
export const findEncodedOptionValue = (
  options: EncodedOption[],
  selectedValue?: string,
): string | undefined => {
  if (!selectedValue) {
    return undefined;
  }
  return options.find(({ value }) => value?.startsWith(`${selectedValue}|`))
    ?.value;
};

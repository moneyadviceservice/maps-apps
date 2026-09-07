type EncodedOption = {
  value?: string;
};

/**
 * Helper to support the "yes|access-options" encoded option values in the booking form.
 * The stored answer is a plain value (e.g. "yes"), and this function finds the corresponding encoded option value.
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

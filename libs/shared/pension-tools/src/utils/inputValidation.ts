export const isInputAllowedDefault = ({
  floatValue,
}: {
  floatValue: number | undefined;
}) => {
  return (floatValue ?? 0) >= 0 && (floatValue ?? 0) <= 999999999;
};

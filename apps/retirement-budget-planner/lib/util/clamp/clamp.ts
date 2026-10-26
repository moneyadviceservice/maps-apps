export type ClampRange = {
  min: number;
  max: number;
};

/**
 * Clamp a number to be within a range defined by min and max values
 *
 * @param value - number to clamp
 * @param range - range object
 * @param range.min - minimum value of the range
 * @param range.max - maximum value of the range
 * @returns clamped value
 */
export const clamp = (value: number, range: ClampRange): number => {
  if (!range || typeof range !== 'object') {
    throw new TypeError(
      'range must be an object with min and max number values',
    );
  }

  const { min, max } = range;

  if (
    !Number.isFinite(value) ||
    !Number.isFinite(min) ||
    !Number.isFinite(max)
  ) {
    throw new TypeError('input values must be finite numbers');
  }

  if (min > max) {
    throw new RangeError('min cannot be greater than max');
  }

  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
};

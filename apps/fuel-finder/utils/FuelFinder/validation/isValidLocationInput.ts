// Characters permitted in a location search: letters (any language, so Welsh
// place names such as "Ynys Môn" pass), numbers, spaces, ampersands,
// apostrophes, hyphens, periods and exclamation marks. Anything outside this
// set (e.g. % $ £ @ # * > ? +) fails validation.
export const ALLOWED_LOCATION_REGEX = /^[\p{L}\p{N} &'.!-]+$/u;

export const isValidLocationInput = (value: string): boolean =>
  ALLOWED_LOCATION_REGEX.test(value);

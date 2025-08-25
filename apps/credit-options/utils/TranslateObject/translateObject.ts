/**
 * Recursively traverses an object or array, applying a translation function `z`
 * to any object that contains both 'en' and 'cy' properties (assumed to be translation objects).
 *
 * @param obj - The input object or array to be traversed and translated.
 * @param z - A function that takes a translation object (with 'en' and 'cy' properties) and returns the translated value.
 * @returns The translated object or array, with all translation objects replaced by the result of `z`.
 */
export const translateObject = (obj: any, z: any): any => {
  const translateItem = (item: any) => {
    if (item && typeof item === 'object' && 'en' in item && 'cy' in item) {
      return z(item);
    }
    return translateObject(item, z);
  };

  const translateArray = (arr: any[]) => arr.map(translateItem);

  const translateObjectProps = (sourceObj: any) =>
    Object.entries(sourceObj).reduce((acc: any, [key, value]) => {
      acc[key] = translateItem(value);
      return acc;
    }, {});

  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return translateArray(obj);
  }

  return translateObjectProps(obj);
};

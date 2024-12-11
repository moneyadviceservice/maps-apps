import { ContactMethod } from '../types';

/**
 * Returns true if the contact method is in the contact methods
 */
export const hasContactMethod = (
  contactMethods: ContactMethod[],
  contactMethod: string,
): boolean => {
  return contactMethods.some((method) => {
    return contactMethod in method.contactMethodDetails;
  });
};

/**
 * Returns true if there is a preferred contact method
 */
export const hasPreferred = (contactMethods: ContactMethod[]): boolean => {
  return contactMethods.some((method) => method.preferred === true);
};

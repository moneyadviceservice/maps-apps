import {
  ContactMethod,
  EmailAddress,
  PensionArrangement,
  PhoneNumber,
  PostalAddress,
  Website,
} from '../types';

const telephoneSort: { [key: string]: string } = {
  M: 'a',
  S: 'b',
  W: 'c',
  N: 'd',
  A: 'e',
};

/**
 * Sorts all contact methods and transforms arrays to reflect new values.
 */
export const transformPensionData = (
  pension: PensionArrangement,
): PensionArrangement => {
  // sort all of the contact methods as per business logic
  // and transform arrays to reflect new values
  const contactMethods: ContactMethod[] = [];
  const telephoneContacts: ContactMethod[] = [];
  const emailContacts: ContactMethod[] = [];
  const postalContacts: ContactMethod[] = [];
  const webContacts: ContactMethod[] = [];

  pension.pensionAdministrator.contactMethods.forEach((method) => {
    if ('email' in method.contactMethodDetails) {
      emailContacts.push(method);
    } else if ('number' in method.contactMethodDetails) {
      // create a new entry for every usage
      const number = method.contactMethodDetails.number;
      method.contactMethodDetails.usage.forEach((usage) => {
        const methodObject: ContactMethod = {
          preferred: method.preferred,
          contactMethodDetails: {
            number: number,
            usage: [usage],
          },
        };
        telephoneContacts.push(methodObject);
      });
    } else if ('postalName' in method.contactMethodDetails) {
      postalContacts.push(method);
    } else if ('url' in method.contactMethodDetails) {
      webContacts.push(method);
    }
  });

  emailContacts.sort((a, b) => {
    const aTyped = a.contactMethodDetails as EmailAddress;
    const bTyped = b.contactMethodDetails as EmailAddress;
    return aTyped.email.localeCompare(bTyped.email);
  });

  webContacts.sort((a, b) => {
    const aTyped = a.contactMethodDetails as Website;
    const bTyped = b.contactMethodDetails as Website;
    return aTyped.url.localeCompare(bTyped.url);
  });

  telephoneContacts.sort((a, b) => {
    const aTyped = a.contactMethodDetails as PhoneNumber;
    const bTyped = b.contactMethodDetails as PhoneNumber;

    // Sort first by usage
    const usageComparison = telephoneSort[aTyped.usage[0]].localeCompare(
      telephoneSort[bTyped.usage[0]],
    );

    // If the usage is the same, sort by number
    if (usageComparison === 0) {
      return aTyped.number.localeCompare(bTyped.number);
    }

    return usageComparison;
  });

  postalContacts.sort((a, b) => {
    const aTyped = a.contactMethodDetails as PostalAddress;
    const bTyped = b.contactMethodDetails as PostalAddress;

    // Move 'GB' to the top
    if (aTyped.countryCode === 'GB' && bTyped.countryCode !== 'GB') {
      return -1;
    } else if (aTyped.countryCode !== 'GB' && bTyped.countryCode === 'GB') {
      return 1;
    }

    // sort by postalName
    return aTyped.postalName.localeCompare(bTyped.postalName);
  });

  contactMethods.push(
    ...telephoneContacts,
    ...emailContacts,
    ...webContacts,
    ...postalContacts,
  );

  pension.pensionAdministrator.contactMethods = contactMethods;

  return pension;
};

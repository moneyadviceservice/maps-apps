/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContactMethods } from '../constants';
import { hasContactMethod, hasPreferred } from './contactMethods';

describe('hasContactMethod', () => {
  it('should return true if the contact method exists', () => {
    // Arrange & Act
    const contactMethods: any[] = [
      {
        contactMethodDetails: { number: '123-456-7890' },
        preferred: false,
      },
      {
        contactMethodDetails: { email: 'example@example.com' },
        preferred: true,
      },
    ];

    // Assert
    expect(hasContactMethod(contactMethods, ContactMethods.TELEPHONE)).toBe(
      true,
    );
    expect(hasContactMethod(contactMethods, ContactMethods.EMAIL)).toBe(true);
  });

  it('should return false if the contact method does not exist', () => {
    // Arrange & Act
    const contactMethods: any[] = [
      {
        contactMethodDetails: { number: '123-456-7890' },
        preferred: false,
      },
      {
        contactMethodDetails: { email: 'example@example.com' },
        preferred: true,
      },
    ];

    // Assert
    expect(hasContactMethod(contactMethods, ContactMethods.POSTAL_NAME)).toBe(
      false,
    );
    expect(hasContactMethod(contactMethods, ContactMethods.WEB_CONTACTS)).toBe(
      false,
    );
  });

  it('should return false if the contactMethods array is empty', () => {
    // Arrange & Act
    const contactMethods: any[] = [];

    // Assert
    expect(hasContactMethod(contactMethods, 'number')).toBe(false);
  });

  it('should return false is preffered contact method is not found', () => {
    // Arrange & Act
    const contactMethods: any[] = [
      {
        contactMethodDetails: { number: '123-456-7890' },
        preferred: false,
      },
    ];

    // Assert
    expect(hasPreferred(contactMethods)).toBe(false);
  });

  it('should return true if the contact method exists and is preferred', () => {
    // Arrange & Act
    const contactMethods: any[] = [
      {
        contactMethodDetails: { number: '123-456-7890' },
        preferred: true,
      },
    ];

    // Assert
    expect(hasPreferred(contactMethods)).toBe(true);
  });
});

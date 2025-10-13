import { validateEmail } from '.';

describe('validateEmail function', () => {
  it('should return true for valid email addresses', () => {
    const validEmails = [
      'test@example.com',
      'test.user@domain.com',
      'user123@test.co.uk',
      'user@mail.sub.example.com',
      'valid-email@domain.subdomain.com',
      'user.name+tag@example.co.uk',
      'name@visiting-vidin.com',
    ];

    validEmails.forEach((email) => {
      expect(validateEmail(email)).toBeTruthy();
    });
  });

  it('should return false for invalid email addresses', () => {
    const invalidEmails = [
      'invalidemail',
      'invalid@.com',
      'invalid@domain.',
      'invalid.@domain.com',
      '@domain.com',
      'invalid@domaincom',
      'invalid@domain..com',
      'invalid@domain!.com',
      'user@sub..domain.com',
    ];

    invalidEmails.forEach((email) => {
      expect(validateEmail(email)).toBeFalsy();
    });
  });

  it('should handle edge cases gracefully', () => {
    const edgeCases = ['', ' ', 'test@', 'test@domain'];

    edgeCases.forEach((email) => {
      expect(validateEmail(email)).toBeFalsy();
    });
  });
});

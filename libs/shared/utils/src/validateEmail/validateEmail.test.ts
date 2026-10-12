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
      'user_name@example.com',
      'first.last@example.co.uk',
      'admin@localhost.localdomain',
      'test+filter@gmail.com',
      '123@example.com',
      'user-name@example-domain.com',
      'name_123@test-server.co.uk',
      'first+last@example.org',
      'email@subdomain.example.com',
      'firstname-lastname@example.com',
      'x@example.co',
      'very.long.email.address@subdomain.example.com',
    ];

    validEmails.forEach((email) => {
      expect(validateEmail(email)).toBe(true);
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
      'user name@example.com',
      'user@domain .com',
      'user@@example.com',
      'user@.example.com',
      'user@example..com',
      '.user@example.com',
      'user.@example.com',
      'user@-example.com',
      'user@example.com-',
      'user#name@example.com',
      'user@',
      '@',
      'user @example.com',
      'user@ example.com',
      'user@exam ple.com',
      'user@.com',
      'user..name@example.com',
    ];

    invalidEmails.forEach((email) => {
      expect(validateEmail(email)).toBe(false);
    });
  });

  it('should handle edge cases gracefully', () => {
    const edgeCases = ['', ' ', 'test@', 'test@domain'];

    edgeCases.forEach((email) => {
      expect(validateEmail(email)).toBe(false);
    });
  });
});

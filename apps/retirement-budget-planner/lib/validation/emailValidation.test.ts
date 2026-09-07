import { validateEmails } from './emailValidation';

describe('validateEmails', () => {
  test('returns null for valid primary email only', () => {
    expect(validateEmails('user@example.com')).toBeNull();
  });

  test('primary email missing (undefined)', () => {
    expect(validateEmails(undefined)).toEqual({
      email: 'email-generic',
    });
  });

  test('primary email empty string returns error for email', () => {
    expect(validateEmails('   ')).toEqual({
      email: 'email-generic',
    });
  });

  test('primary email with invalid format returns error for email', () => {
    expect(validateEmails('user@.com')).toEqual({
      email: 'email-generic',
    });
  });

  test('primary email with surrounding whitespace and mixed case is valid (trim + case-insensitive)', () => {
    expect(validateEmails('  USER@Example.COM  ')).toBeNull();
  });
});

import { validateEmails } from './emailValidation';

describe('validateEmails', () => {
  test('returns null for valid primary email only', () => {
    expect(validateEmails('user@example.com', undefined)).toBeNull();
  });

  test('returns null for valid primary and secondary emails', () => {
    expect(
      validateEmails('user@example.com', 'otherperson@example.co.uk'),
    ).toBeNull();
  });

  test('primary email missing (undefined) returns error for email1', () => {
    expect(validateEmails(undefined, undefined)).toEqual({
      email1: 'email-generic',
    });
  });

  test('primary email empty string returns error for email1', () => {
    expect(validateEmails('   ', undefined)).toEqual({
      email1: 'email-generic',
    });
  });

  test('primary email with invalid format returns error for email1', () => {
    expect(validateEmails('user@.com', undefined)).toEqual({
      email1: 'email-generic',
    });
  });

  test('primary email with surrounding whitespace and mixed case is valid (trim + case-insensitive)', () => {
    expect(validateEmails('  USER@Example.COM  ', undefined)).toBeNull();
  });

  test('secondary email undefined is allowed', () => {
    expect(validateEmails('user@example.com', undefined)).toBeNull();
  });

  test('secondary email null is allowed', () => {
    // function signature doesn't include null, cast to satisfy TS but exercise runtime path
    expect(
      validateEmails('user@example.com', null as unknown as string | undefined),
    ).toBeNull();
  });

  test('secondary email empty string (or whitespace) is allowed', () => {
    expect(validateEmails('user@example.com', '')).toBeNull();
    expect(validateEmails('user@example.com', '   ')).toBeNull();
  });

  test('secondary email invalid format returns error for email2 only', () => {
    expect(validateEmails('user@example.com', 'invalid-email')).toEqual({
      email2: 'email-generic',
    });
  });

  test('secondary non-string value returns error for email2 only', () => {
    expect(
      validateEmails('user@example.com', 123 as unknown as string | undefined),
    ).toEqual({
      email2: 'email-generic',
    });
  });

  test('both emails invalid returns errors for both fields', () => {
    expect(validateEmails('.user@bad', 'also@bad.')).toEqual({
      email1: 'email-generic',
      email2: 'email-generic',
    });
  });
});

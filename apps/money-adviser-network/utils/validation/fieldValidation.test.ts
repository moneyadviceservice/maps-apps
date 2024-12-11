import {
  emailField,
  phoneField,
  postcodeField,
  referenceField,
  textField,
} from './fieldValidation';

describe('Validation Functions', () => {
  describe('textField', () => {
    it('should return true for valid text length and allowed characters', () => {
      expect(textField('Hello')).toBe(true);
      expect(textField('Anne-Marie')).toBe(true);
      expect(textField("O'Connor")).toBe(true);
      expect(textField('Mary_Jo')).toBe(true);
      expect(textField('A'.repeat(30))).toBe(true);
    });

    it('should return false for invalid text length, disallowed characters and patterns', () => {
      expect(textField('')).toBe(false);
      expect(textField('A')).toBe(false);
      expect(textField('A'.repeat(31))).toBe(false);
      expect(textField('No spaces')).toBe(false);
      expect(textField('Exclamation!')).toBe(false);
      expect(textField('-no-leading')).toBe(false);
      expect(textField('no-trailing-')).toBe(false);
      expect(textField('no--consecutive')).toBe(false);
      expect(textField('no--consecutive')).toBe(false);
    });
  });

  describe('referenceField', () => {
    it('should return true for valid text length and allowed characters', () => {
      expect(referenceField('C-123/45_AB')).toBe(true);
      expect(referenceField('c')).toBe(true);
      expect(referenceField('A'.repeat(20))).toBe(true);
      expect(referenceField('-C-123/45__AB-')).toBe(true);
    });

    it('should return false for invalid text length, disallowed characters and patterns', () => {
      expect(referenceField('')).toBe(false);
      expect(referenceField('A'.repeat(21))).toBe(false);
      expect(referenceField('Allow spaces')).toBe(true);
      expect(referenceField('No-Exclamation!')).toBe(false);
    });
  });

  describe('emailField', () => {
    it('should return true for valid email addresses', () => {
      expect(emailField('test@example.com')).toBe(true);
      expect(emailField('user.name@domain.co.uk')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(emailField('plainaddress')).toBe(false);
      expect(emailField('missing@domain')).toBe(false);
      expect(emailField('missing.domain@.com')).toBe(false);
    });
  });

  describe('phoneField', () => {
    it('should return true for valid UK phone numbers', () => {
      expect(phoneField('+441234567890')).toBe(true);
      expect(phoneField('01234 567890')).toBe(true);
    });

    it('should return false for invalid phone numbers', () => {
      expect(phoneField('1234567890')).toBe(false);
      expect(phoneField('12345')).toBe(false);
      expect(phoneField('+9991234567890')).toBe(false);
    });
  });

  describe('postcodeField', () => {
    it('should return true for valid UK postcodes', () => {
      expect(postcodeField('SW1A 1AA')).toBe(true);
      expect(postcodeField('EC1A 1BB')).toBe(true);
    });

    it('should return false for invalid postcodes', () => {
      expect(postcodeField('12345')).toBe(false);
      expect(postcodeField('INVALID')).toBe(false);
      expect(postcodeField('AA1')).toBe(false);
    });
  });
});

import { isInputAllowedDefault } from './inputValidation';

describe('inputValidation', () => {
  it('should return false if the input is a negative number', () => {
    expect(isInputAllowedDefault({ floatValue: -1 })).toBe(false);
  });

  it('should return false if the input is a very big number', () => {
    expect(isInputAllowedDefault({ floatValue: 10000000000 })).toBe(false);
  });

  it('should return true if the input is 0', () => {
    expect(isInputAllowedDefault({ floatValue: 0 })).toBe(true);
  });

  it('should return true if the input is a number between 0 and 10000000000', () => {
    expect(isInputAllowedDefault({ floatValue: 50 })).toBe(true);
  });

  it('should return true if the input is undefined', () => {
    expect(isInputAllowedDefault({ floatValue: undefined })).toBe(true);
  });
});

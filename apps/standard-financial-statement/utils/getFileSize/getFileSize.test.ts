import { getFileSize } from './';

describe('getFileSize', () => {
  it('should return the correct value 0', () => {
    expect(getFileSize(0)).toBe('0 Bytes');
  });

  it('should return the correct value 10kb', () => {
    expect(getFileSize(10000)).toBe('10 KB');
  });

  it('should return the correct value 78 KB', () => {
    expect(getFileSize(79835)).toBe('78 KB');
  });

  it('should return the correct value 443 KB', () => {
    expect(getFileSize(454093)).toBe('443 KB');
  });
});

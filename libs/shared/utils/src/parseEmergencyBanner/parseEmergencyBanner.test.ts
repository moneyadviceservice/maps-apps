import { parseEmergencyBanner } from './parseEmergencyBanner';

describe('parseEmergencyBanner', () => {
  it('should return null for empty content', () => {
    expect(parseEmergencyBanner(null)).toBeNull();
    expect(parseEmergencyBanner(undefined)).toBeNull();
    expect(parseEmergencyBanner('')).toBeNull();
  });

  it('should parse valid JSON content with en and cy fields', () => {
    const content = JSON.stringify({
      en: 'English message',
      cy: 'Welsh message',
    });

    const result = parseEmergencyBanner(content);

    expect(result).toEqual({
      en: 'English message',
      cy: 'Welsh message',
      variant: 'default',
    });
  });

  it('should handle newlines in JSON strings', () => {
    const content = '{"en":"Message with\nnewline","cy":"Welsh with\nnewline"}';

    const result = parseEmergencyBanner(content);

    expect(result).toEqual({
      en: 'Message with\nnewline',
      cy: 'Welsh with\nnewline',
      variant: 'default',
    });
  });

  it('should return null for JSON without en or cy fields', () => {
    const content = JSON.stringify({
      foo: 'bar',
    });

    const result = parseEmergencyBanner(content);

    expect(result).toBeNull();
  });

  it('should return null for JSON with only en field', () => {
    const content = JSON.stringify({
      en: 'English only',
    });

    const result = parseEmergencyBanner(content);

    expect(result).toBeNull();
  });

  it('should return null for JSON with only cy field', () => {
    const content = JSON.stringify({
      cy: 'Welsh only',
    });

    const result = parseEmergencyBanner(content);

    expect(result).toBeNull();
  });

  it('should return null for invalid JSON', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const result = parseEmergencyBanner('invalid json {');

    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to parse emergency banner content:',
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });
});

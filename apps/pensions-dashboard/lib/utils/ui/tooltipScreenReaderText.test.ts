import { tooltipScreenReaderText } from './tooltipScreenReaderText';

describe('tooltipScreenReaderText', () => {
  const mockT = jest.fn();

  beforeEach(() => {
    mockT.mockClear();
    mockT.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        'common.more-information': 'Show more information',
        'common.on': 'on',
      };
      return translations[key] || key;
    });
  });
  it('should return formatted text for screen readers with tooltip content', () => {
    const result = tooltipScreenReaderText('tooltip content', mockT);
    expect(result).toContain('Show more information on tooltip content');
  });
});
